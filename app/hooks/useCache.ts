import {MutableRefObject, useEffect, useRef} from "react";
import {CacheEntry} from "@/app/types";

/**
 * implement useCache hook to cache a value
 */
const DEFAULT_INVALIDATION_TIMEOUT = 20000; // 20 seconds

export default function useCache<T>(invalidationTimeout: number = DEFAULT_INVALIDATION_TIMEOUT) {
    const cache = useRef(new Map<string, CacheEntry<T>>());
    const invalidateCacheTimeout: MutableRefObject<number | undefined> = useRef(undefined);
    const clearInvalidatedCacheEntries = () => {
        const now = Date.now()
        for (const [key, cacheEntry] of cache.current.entries()) {
            if (now - cacheEntry.cachedAt.getTime() >= invalidationTimeout) {
                cache.current.delete(key);
            }
        }
    };

    useEffect(() => {
        // cleanup
        return () => clearTimeout(invalidateCacheTimeout.current)
    }, []);

    return async (key: string, loader: () => Promise<T>) => {
        if (cache.current.has(key)) {
            return cache.current.get(key)?.entry as T;
        }

        const entry = await loader();
        cache.current.set(key, {
            cachedAt: new Date(),
            entry,
        });

        clearTimeout(invalidateCacheTimeout.current);
        invalidateCacheTimeout.current = window.setTimeout(clearInvalidatedCacheEntries, invalidationTimeout + 1000);

        return entry;
    };
}
