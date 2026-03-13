import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { ConflictEvent, AgentRun } from '../types';
import { addEvents, logAgentRun, eventExists, createEventId } from '../utils';
import { extractWithClaude } from '../utils/claudeExtractor';

interface OSINTSource {
  url: string;
  name: string;
  articleSelector: string;
  titleSelector: string;
  contentSelector: string;
}

const OSINT_SOURCES: OSINTSource[] = [
  {
    url: 'https://www.understandingwar.org',
    name: 'ISW',
    articleSelector: 'article, .post, .entry',
    titleSelector: 'h2, h3, .entry-title',
    contentSelector: 'p, .excerpt, .entry-content'
  },
  {
    url: 'https://acleddata.com/conflict-watchlist/',
    name: 'ACLED',
    articleSelector: '.post, article, .watchlist-item',
    titleSelector: 'h2, h3, .post-title',
    contentSelector: 'p, .excerpt'
  }
];

async function fetchOSINTPage(source: OSINTSource): Promise<Array<{ title: string; content: string; url: string }>> {
  try {
    const response = await fetch(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    });

    if (!response.ok) {
      console.log(`[OSINTMonitor] Failed to fetch ${source.url}: ${response.status}`);
      return [];
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const articles: Array<{ title: string; content: string; url: string }> = [];

    $(source.articleSelector).slice(0, 5).each((_, element) => {
      const title = $(element).find(source.titleSelector).first().text().trim();
      const content = $(element).find(source.contentSelector).first().text().trim();
      const linkElem = $(element).find('a[href]').first();
      let articleUrl = linkElem.attr('href') || source.url;

      if (articleUrl && !articleUrl.startsWith('http')) {
        const baseUrl = new URL(source.url);
        articleUrl = `${baseUrl.origin}${articleUrl.startsWith('/') ? '' : '/'}${articleUrl}`;
      }

      if (title && title.length > 10) {
        articles.push({ title, content: content || title, url: articleUrl });
      }
    });

    return articles;
  } catch (error) {
    console.error(`[OSINTMonitor] Error fetching ${source.url}:`, error);
    return [];
  }
}

export async function runOSINTMonitor(): Promise<AgentRun> {
  const agentId = 'osintMonitor';
  const runAt = new Date().toISOString();
  const errors: string[] = [];
  const newEvents: ConflictEvent[] = [];

  console.log('[OSINTMonitor] Starting run...');

  for (const source of OSINT_SOURCES) {
    try {
      console.log(`[OSINTMonitor] Fetching ${source.name}...`);
      const articles = await fetchOSINTPage(source);

      console.log(`[OSINTMonitor] Found ${articles.length} articles from ${source.name}`);

      for (const article of articles.slice(0, 3)) { // Limit per source
        const eventId = createEventId(source.name, article.title);

        if (eventExists(eventId)) {
          continue;
        }

        const extraction = await extractWithClaude(article.title, article.content, 'osint');

        if (extraction && extraction.isRelevantToIranConflict) {
          const event: ConflictEvent = {
            id: eventId,
            timestamp: new Date().toISOString(),
            source: agentId,
            sourceUrl: article.url,
            eventType: extraction.eventType,
            actor1: extraction.actor1,
            actor2: extraction.actor2,
            location: extraction.location || 'Unknown',
            lat: extraction.lat,
            lon: extraction.lon,
            summary: extraction.summary,
            confidence: extraction.confidence,
            validated: false,
            rawHeadline: article.title
          };

          newEvents.push(event);
          console.log(`[OSINTMonitor] Extracted event: ${extraction.summary}`);
        }

        await new Promise(r => setTimeout(r, 500));
      }
    } catch (error) {
      const errMsg = `Error processing ${source.name}: ${error}`;
      console.error(`[OSINTMonitor] ${errMsg}`);
      errors.push(errMsg);
    }
  }

  const addedCount = addEvents(newEvents);
  console.log(`[OSINTMonitor] Added ${addedCount} new events`);

  const run: AgentRun = {
    agentId,
    runAt,
    eventsFound: addedCount,
    errors
  };

  logAgentRun(run);
  return run;
}
