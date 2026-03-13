import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { ConflictEvent, FeedItem, AgentRun } from '../types';
import { addEvents, logAgentRun, eventExists, createEventId } from '../utils';
import { extractWithClaude } from '../utils/claudeExtractor';

const RSS_FEEDS = [
  'https://www.aljazeera.com/xml/rss/all.xml',
  'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml',
  'https://rss.nytimes.com/services/xml/rss/nyt/MiddleEast.xml',
  'https://www.theguardian.com/world/middleeast/rss'
];

const CONFLICT_KEYWORDS = [
  'iran', 'hormuz', 'irgc', 'strike', 'missile', 'drone', 'hezbollah',
  'vlcc', 'tanker', 'khamenei', 'larijani', 'gulf', 'coalition',
  'epic fury', 'desalination', 'bahrain', 'qatar', 'uae', 'kuwait', 'saudi',
  'houthi', 'yemen', 'red sea', 'israel', 'lebanon', 'syria', 'iraq',
  'attack', 'military', 'naval', 'war', 'conflict', 'bomb', 'explosion'
];

async function fetchFeed(url: string): Promise<FeedItem[]> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    });

    if (!response.ok) {
      console.log(`[NewsScanner] Failed to fetch ${url}: ${response.status}`);
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
    console.error(`[NewsScanner] Error fetching ${url}:`, error);
    return [];
  }
}

function isRecentItem(item: FeedItem, hoursAgo: number = 2): boolean {
  const cutoff = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
  return item.pubDate >= cutoff;
}

function matchesKeywords(item: FeedItem): boolean {
  const text = `${item.title} ${item.description}`.toLowerCase();
  return CONFLICT_KEYWORDS.some(keyword => text.includes(keyword));
}

export async function runNewsScanner(hoursBack: number = 2): Promise<AgentRun> {
  const agentId = 'newsScanner';
  const runAt = new Date().toISOString();
  const errors: string[] = [];
  const newEvents: ConflictEvent[] = [];

  console.log(`[NewsScanner] Starting run (looking back ${hoursBack} hours)...`);

  for (const feedUrl of RSS_FEEDS) {
    try {
      console.log(`[NewsScanner] Fetching ${feedUrl}...`);
      const items = await fetchFeed(feedUrl);

      const recentItems = items.filter(item => isRecentItem(item, hoursBack));
      const relevantItems = recentItems.filter(item => matchesKeywords(item));

      console.log(`[NewsScanner] Found ${relevantItems.length} relevant items from ${feedUrl}`);

      for (const item of relevantItems.slice(0, 5)) { // Limit per feed to control API usage
        const eventId = createEventId(feedUrl, item.title);

        if (eventExists(eventId)) {
          continue;
        }

        const extraction = await extractWithClaude(item.title, item.description, 'news');

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
          console.log(`[NewsScanner] Extracted event: ${extraction.summary}`);
        }

        // Small delay between API calls
        await new Promise(r => setTimeout(r, 500));
      }
    } catch (error) {
      const errMsg = `Error processing ${feedUrl}: ${error}`;
      console.error(`[NewsScanner] ${errMsg}`);
      errors.push(errMsg);
    }
  }

  const addedCount = addEvents(newEvents);
  console.log(`[NewsScanner] Added ${addedCount} new events`);

  const run: AgentRun = {
    agentId,
    runAt,
    eventsFound: addedCount,
    errors
  };

  logAgentRun(run);
  return run;
}
