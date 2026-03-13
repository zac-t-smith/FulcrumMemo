import * as crypto from 'crypto';

export function createEventId(source: string, headline: string): string {
  const combined = `${source}:${headline}`.toLowerCase().trim();
  return crypto.createHash('md5').update(combined).digest('hex').substring(0, 16);
}
