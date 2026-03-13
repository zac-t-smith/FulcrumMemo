interface QueuedCall<T> {
  fn: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: Error) => void;
}

class RateLimiter {
  private callsThisMinute: number = 0;
  private lastResetTime: number = Date.now();
  private maxCallsPerMinute: number;
  private queue: QueuedCall<unknown>[] = [];
  private isProcessingQueue: boolean = false;

  constructor(maxCallsPerMinute: number = 14) {
    this.maxCallsPerMinute = maxCallsPerMinute;
  }

  private resetIfNeeded(): void {
    const now = Date.now();
    if (now - this.lastResetTime >= 60000) {
      this.callsThisMinute = 0;
      this.lastResetTime = now;
    }
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    this.resetIfNeeded();

    if (this.callsThisMinute < this.maxCallsPerMinute) {
      this.callsThisMinute++;
      if (this.callsThisMinute >= this.maxCallsPerMinute - 2) {
        console.log(`[RateLimiter] Approaching limit: ${this.callsThisMinute}/${this.maxCallsPerMinute} calls this minute`);
      }
      return fn();
    }

    console.log(`[RateLimiter] Rate limit reached, queueing call. Queue size: ${this.queue.length + 1}`);

    return new Promise<T>((resolve, reject) => {
      this.queue.push({ fn, resolve: resolve as (value: unknown) => void, reject });
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue) return;
    this.isProcessingQueue = true;

    while (this.queue.length > 0) {
      this.resetIfNeeded();

      if (this.callsThisMinute < this.maxCallsPerMinute) {
        const item = this.queue.shift();
        if (item) {
          this.callsThisMinute++;
          try {
            const result = await item.fn();
            item.resolve(result);
          } catch (error) {
            item.reject(error as Error);
          }
        }
      } else {
        const waitTime = 60000 - (Date.now() - this.lastResetTime) + 1000;
        console.log(`[RateLimiter] Waiting ${Math.ceil(waitTime / 1000)}s for rate limit reset...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    this.isProcessingQueue = false;
  }

  getStatus(): { callsThisMinute: number; queueSize: number } {
    this.resetIfNeeded();
    return {
      callsThisMinute: this.callsThisMinute,
      queueSize: this.queue.length
    };
  }
}

export const geminiRateLimiter = new RateLimiter(14);
export const nominatimRateLimiter = new RateLimiter(1);
