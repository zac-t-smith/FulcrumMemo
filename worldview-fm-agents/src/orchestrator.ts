import dotenv from 'dotenv';
import cron from 'node-cron';
import {
  runNewsScanner,
  runOSINTMonitor,
  runShippingMonitor,
  runValidator,
  runGeocoder,
  runHistoricalBackfill,
  needsBackfill
} from './agents';
import { startServer } from './server';

dotenv.config();

console.log('========================================');
console.log('  WorldView-FM Agent Swarm');
console.log('  Real-Time Conflict Intelligence');
console.log('========================================');
console.log('');

// Track running state to prevent overlapping runs
const agentState = {
  newsScanner: { running: false },
  osintMonitor: { running: false },
  shippingMonitor: { running: false },
  validator: { running: false },
  geocoder: { running: false }
};

async function runAgentWithPostProcessing(
  agentName: keyof typeof agentState,
  agentFn: () => Promise<unknown>
): Promise<void> {
  if (agentState[agentName].running) {
    console.log(`[Orchestrator] ${agentName} is already running, skipping...`);
    return;
  }

  agentState[agentName].running = true;

  try {
    console.log(`\n[Orchestrator] ====== Starting ${agentName} ======`);
    await agentFn();

    // After each scanning agent, run validator and geocoder
    if (agentName !== 'validator' && agentName !== 'geocoder') {
      console.log(`[Orchestrator] Running post-processing for ${agentName}...`);

      // Run validator
      if (!agentState.validator.running) {
        agentState.validator.running = true;
        try {
          await runValidator();
        } finally {
          agentState.validator.running = false;
        }
      }

      // Run geocoder
      if (!agentState.geocoder.running) {
        agentState.geocoder.running = true;
        try {
          await runGeocoder();
        } finally {
          agentState.geocoder.running = false;
        }
      }
    }

    console.log(`[Orchestrator] ====== Completed ${agentName} ======\n`);
  } catch (error) {
    console.error(`[Orchestrator] Error running ${agentName}:`, error);
  } finally {
    agentState[agentName].running = false;
  }
}

async function runAllAgents(): Promise<void> {
  console.log('\n[Orchestrator] ========== RUNNING ALL AGENTS ==========\n');

  // Run agents sequentially to avoid rate limit issues
  await runAgentWithPostProcessing('newsScanner', () => runNewsScanner());
  await runAgentWithPostProcessing('osintMonitor', runOSINTMonitor);
  await runAgentWithPostProcessing('shippingMonitor', runShippingMonitor);

  console.log('\n[Orchestrator] ========== ALL AGENTS COMPLETED ==========\n');
}

function setupCronJobs(): void {
  console.log('[Orchestrator] Setting up cron schedules...');

  // News Scanner: Every 15 minutes
  cron.schedule('*/15 * * * *', () => {
    console.log('[Cron] Triggering News Scanner...');
    runAgentWithPostProcessing('newsScanner', () => runNewsScanner());
  });
  console.log('  - News Scanner: Every 15 minutes');

  // OSINT Monitor: Every 20 minutes
  cron.schedule('*/20 * * * *', () => {
    console.log('[Cron] Triggering OSINT Monitor...');
    runAgentWithPostProcessing('osintMonitor', runOSINTMonitor);
  });
  console.log('  - OSINT Monitor: Every 20 minutes');

  // Shipping Monitor: Every 30 minutes
  cron.schedule('*/30 * * * *', () => {
    console.log('[Cron] Triggering Shipping Monitor...');
    runAgentWithPostProcessing('shippingMonitor', runShippingMonitor);
  });
  console.log('  - Shipping Monitor: Every 30 minutes');

  console.log('[Orchestrator] Cron jobs configured');
}

// Exported function to initialize agents (called from server.ts)
export async function initializeAgents(): Promise<void> {
  console.log('[Orchestrator] Initializing agents...');
  console.log(`[Orchestrator] Anthropic API Key: ${process.env.ANTHROPIC_API_KEY ? 'Set' : 'MISSING'}`);

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('[Orchestrator] ERROR: Missing ANTHROPIC_API_KEY');
    return;
  }

  // Check if historical backfill is needed
  if (needsBackfill()) {
    console.log('\n[Orchestrator] Running historical backfill (first-time setup)...');
    await runHistoricalBackfill();
  }

  // Setup cron jobs for scheduled runs
  setupCronJobs();

  // Run all agents immediately on startup
  console.log('\n[Orchestrator] Running initial agent sweep...');
  await runAllAgents();

  console.log('[Orchestrator] Agent swarm is now active and monitoring.\n');
}

async function main(): Promise<void> {
  // Start the Express API server (skipAgents=true since we call initializeAgents below)
  startServer(true);

  // Initialize agents
  await initializeAgents();
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[Orchestrator] Shutting down agent swarm...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n[Orchestrator] Received SIGTERM, shutting down...');
  process.exit(0);
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('[Orchestrator] Uncaught exception:', error);
  // Don't exit - keep running
});

process.on('unhandledRejection', (reason) => {
  console.error('[Orchestrator] Unhandled rejection:', reason);
  // Don't exit - keep running
});

// Only run main() when this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}
