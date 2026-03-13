import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { ConflictEvent, AgentRun, FeedItem } from '../types';
import { addEvents, logAgentRun, eventExists, createEventId } from '../utils';
import { extractWithClaude } from '../utils/claudeExtractor';

const SHIPPING_FEEDS = [
  'https://www.hellenicshippingnews.com/feed/',
  'https://gcaptain.com/feed/',
  'https://splash247.com/feed/'
];

const SHIPPING_KEYWORDS = [
  'hormuz', 'tanker', 'vlcc', 'war risk', 'p&i', 'insurance',
  'vessel', 'cargo', 'lng', 'crude', 'shipping', 'aframax',
  'suezmax', 'persian gulf', 'strait', 'iran', 'gulf of oman',
  'red sea', 'houthi', 'port closure', 'maritime'
];

async function fetchShippingFeed(url: string): Promise<FeedItem[]> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    });

    if (!response.ok) {
      console.log(`[ShippingMonitor] Failed to fetch ${url}: ${response.status}`);
      return [];
    }

    const xml = await response.text();
    const $ = cheerio.load(xml, { xmlMode: true });
    const items: FeedItem[] = [];

    $('item').each((_, element) => {
      const title = $(element).find('title').text().trim();
      const description = $(element).find('description').text().trim();
      const pubDateStr = $(element).find('pubDate').text().trim();
      const link = $(element).find('link').text().trim();

      if (title && pubDateStr) {
        const pubDate = new Date(pubDateStr);
        items.push({ title, description, pubDate, link });
      }
    });

    return items;
  } catch (error) {
    console.error(`[ShippingMonitor] Error fetching ${url}:`, error);
    return [];
  }
}

function matchesShippingKeywords(item: FeedItem): boolean {
  const text = `${item.title} ${item.description}`.toLowerCase();
  return SHIPPING_KEYWORDS.some(keyword => text.includes(keyword));
}

function isRecentItem(item: FeedItem, hoursAgo: number = 6): boolean {
  const cutoff = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
  return item.pubDate >= cutoff;
}

export async function runShippingMonitor(): Promise<AgentRun> {
  const agentId = 'shippingMonitor';
  const runAt = new Date().toISOString();
  const errors: string[] = [];
  const newEvents: ConflictEvent[] = [];

  console.log('[ShippingMonitor] Starting run...');

  for (const feedUrl of SHIPPING_FEEDS) {
    try {
      console.log(`[ShippingMonitor] Fetching ${feedUrl}...`);
      const items = await fetchShippingFeed(feedUrl);

      const recentItems = items.filter(item => isRecentItem(item));
      const relevantItems = recentItems.filter(item => matchesShippingKeywords(item));

      console.log(`[ShippingMonitor] Found ${relevantItems.length} relevant items from ${feedUrl}`);

      for (const item of relevantItems.slice(0, 3)) { // Limit per feed
        const eventId = createEventId(feedUrl, item.title);

        if (eventExists(eventId)) {
          continue;
        }

        const extraction = await extractWithClaude(item.title, item.description, 'shipping');

        if (extraction && extraction.isRelevantToIranConflict) {
          const event: ConflictEvent = {
            id: eventId,
            timestamp: item.pubDate.toISOString(),
            source: agentId,
            sourceUrl: item.link,
            eventType: extraction.eventType,
            actor1: extraction.actor1,
            actor2: extraction.actor2,
            location: extraction.location || 'Unknown',
            lat: extraction.lat,
            lon: extraction.lon,
            summary: extraction.summary,
            confidence: extraction.confidence,
            validated: false,
            rawHeadline: item.title
          };

          newEvents.push(event);
          console.log(`[ShippingMonitor] Extracted event: ${extraction.summary}`);
        }

        await new Promise(r => setTimeout(r, 500));
      }
    } catch (error) {
      const errMsg = `Error processing ${feedUrl}: ${error}`;
      console.error(`[ShippingMonitor] ${errMsg}`);
      errors.push(errMsg);
    }
  }

  const addedCount = addEvents(newEvents);
  console.log(`[ShippingMonitor] Added ${addedCount} new events`);

  const run: AgentRun = {
    agentId,
    runAt,
    eventsFound: addedCount,
    errors
  };

  logAgentRun(run);
  return run;
}
