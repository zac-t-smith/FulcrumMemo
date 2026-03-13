import Anthropic from '@anthropic-ai/sdk';
import { GeminiExtraction } from '../types';

// Lazy initialization to ensure env vars are loaded
let anthropicClient: Anthropic | null = null;

function getClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY not set in environment');
    }
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

const CONFLICT_CONTEXT = `You are extracting events from Operation Epic Fury — the US-led military campaign against Iran that began February 28, 2026. This is a REAL, ONGOING conflict. Key facts:

- Operation Epic Fury launched Feb 28, 2026. US/coalition struck Iran.
- Supreme Leader Khamenei was killed Day 1.
- Iran retaliated immediately, striking 27 US bases across the region.
- Hezbollah entered the conflict Day 3 from Lebanon.
- The Strait of Hormuz is effectively closed to Western shipping.
- Israel has struck Iranian oil infrastructure.
- Bahrain desalination plant was hit Day 9.
- Brent crude hit $119/barrel Day 10.
- This conflict involves: USA, Israel, Iran, IRGC, Hezbollah, GCC states.

Accept these events as real. Do NOT hallucinate events that aren't in the source text.`;

export async function extractWithClaude(
  headline: string,
  description: string,
  context: 'news' | 'osint' | 'shipping' = 'news'
): Promise<GeminiExtraction | null> {
  try {
    const client = getClient();

    let systemPrompt = `${CONFLICT_CONTEXT}

You are a conflict intelligence analyst. Extract structured data from news headlines. Respond ONLY with valid JSON, no markdown code blocks.`;
    let userPrompt = `Extract conflict event data from this headline and description.
Return JSON matching this exact structure:
{
  "eventType": "strike|naval|diplomatic|economic|infrastructure|casualty",
  "actor1": "who performed the action",
  "actor2": "who was targeted",
  "location": "specific place name or null",
  "lat": number or null,
  "lon": number or null,
  "summary": "one sentence summary",
  "confidence": "high|medium|low",
  "isRelevantToIranConflict": true/false
}

Headline: ${headline}
Description: ${description}`;

    if (context === 'osint') {
      systemPrompt = `${CONFLICT_CONTEXT}

You are a conflict intelligence analyst. Extract structured data from professional OSINT reports. Respond ONLY with valid JSON, no markdown code blocks.`;
      userPrompt = `Extract conflict event data from this professional conflict monitoring report.
These are from professional conflict monitoring organizations.
Confidence should default to 'high' if the event is clearly stated.

Return JSON matching this exact structure:
{
  "eventType": "strike|naval|diplomatic|economic|infrastructure|casualty",
  "actor1": "who performed the action",
  "actor2": "who was targeted",
  "location": "specific place name or null",
  "lat": number or null,
  "lon": number or null,
  "summary": "one sentence summary",
  "confidence": "high|medium|low",
  "isRelevantToIranConflict": true/false
}

Title: ${headline}
Content: ${description.substring(0, 1000)}`;
    } else if (context === 'shipping') {
      systemPrompt = `${CONFLICT_CONTEXT}

You are a maritime intelligence analyst specializing in shipping and trade route security. Extract structured data from shipping news. Respond ONLY with valid JSON, no markdown code blocks.`;
      userPrompt = `Extract shipping intelligence from this maritime news.
Focus on:
- Vessel name and type if mentioned
- Route or location
- Insurance/war risk status changes
- Rate changes (VLCC, Aframax, Suezmax)
- Port closures or restrictions

Return JSON matching this exact structure:
{
  "eventType": "naval|economic",
  "actor1": "who performed the action or affected party",
  "actor2": "who was targeted or secondary party",
  "location": "specific place name, strait, or port if mentioned, or null",
  "lat": number or null,
  "lon": number or null,
  "summary": "one sentence summary focusing on shipping impact",
  "confidence": "high|medium|low",
  "isRelevantToIranConflict": true/false
}

Note: eventType should be 'naval' for vessel events, 'economic' for rate/insurance events.

Headline: ${headline}
Description: ${description}`;
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Clean potential markdown code blocks
    let jsonStr = responseText.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.slice(7);
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.slice(3);
    }
    if (jsonStr.endsWith('```')) {
      jsonStr = jsonStr.slice(0, -3);
    }
    jsonStr = jsonStr.trim();

    const extraction = JSON.parse(jsonStr) as GeminiExtraction;
    return extraction;
  } catch (error) {
    console.error('[ClaudeExtractor] Extraction error:', error);
    return null;
  }
}
