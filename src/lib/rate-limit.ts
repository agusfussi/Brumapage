interface RateLimitRecord {
  attempts: number;
  blockedUntil?: number;
  firstAttemptAt: number;
  lastAttemptAt: number;
}

// In-memory tracker for server runtime
const tracker = new Map<string, RateLimitRecord>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// Clean up stale entries every 10 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of tracker.entries()) {
      if (record.blockedUntil && record.blockedUntil > now) continue;
      if (now - record.lastAttemptAt > WINDOW_MS) {
        tracker.delete(key);
      }
    }
  }, 10 * 60 * 1000);
}

export const rateLimiter = {
  /**
   * Check if a given key (e.g. client IP) is currently allowed to attempt login.
   */
  check(key: string): { allowed: boolean; remainingAttempts: number; retryAfterSeconds: number } {
    const now = Date.now();
    const record = tracker.get(key);

    if (!record) {
      return { allowed: true, remainingAttempts: MAX_ATTEMPTS, retryAfterSeconds: 0 };
    }

    // If blocked
    if (record.blockedUntil && record.blockedUntil > now) {
      const retryAfterSeconds = Math.ceil((record.blockedUntil - now) / 1000);
      return { allowed: false, remainingAttempts: 0, retryAfterSeconds };
    }

    // Reset if window has elapsed
    if (now - record.firstAttemptAt > WINDOW_MS) {
      tracker.delete(key);
      return { allowed: true, remainingAttempts: MAX_ATTEMPTS, retryAfterSeconds: 0 };
    }

    const remainingAttempts = Math.max(0, MAX_ATTEMPTS - record.attempts);
    return {
      allowed: remainingAttempts > 0,
      remainingAttempts,
      retryAfterSeconds: 0,
    };
  },

  /**
   * Record a failed attempt. If exceeding MAX_ATTEMPTS, blocks the key for BLOCK_DURATION_MS.
   */
  recordFailed(key: string): { isBlocked: boolean; remainingAttempts: number; retryAfterMinutes: number } {
    const now = Date.now();
    let record = tracker.get(key);

    if (!record || now - record.firstAttemptAt > WINDOW_MS) {
      record = {
        attempts: 1,
        firstAttemptAt: now,
        lastAttemptAt: now,
      };
      tracker.set(key, record);
      return { isBlocked: false, remainingAttempts: MAX_ATTEMPTS - 1, retryAfterMinutes: 0 };
    }

    record.attempts += 1;
    record.lastAttemptAt = now;

    if (record.attempts >= MAX_ATTEMPTS) {
      record.blockedUntil = now + BLOCK_DURATION_MS;
      return {
        isBlocked: true,
        remainingAttempts: 0,
        retryAfterMinutes: Math.ceil(BLOCK_DURATION_MS / (60 * 1000)),
      };
    }

    return {
      isBlocked: false,
      remainingAttempts: Math.max(0, MAX_ATTEMPTS - record.attempts),
      retryAfterMinutes: 0,
    };
  },

  /**
   * Reset the tracker on successful authentication.
   */
  reset(key: string) {
    tracker.delete(key);
  },
};
