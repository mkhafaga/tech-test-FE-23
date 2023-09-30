export interface Payout {
  username: string;
  status: string;
  dateAndTime: string;
  value: string;
}

export interface CacheEntry<T> {
  entry: T;
  cachedAt: Date;
}

export interface Metadata {
  page: number;
  limit: number;
  totalCount: number;
}

export interface PayoutsWithMetadata {
  data: Payout[];
  metadata: Metadata;
}

export interface PageState {
  data: Payout[];
  total: number;
  isInitial?: boolean;
}

// export { Payout, Metadata, PayoutsWithMetadata };
