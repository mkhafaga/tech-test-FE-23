export interface Payout {
  username: string;
  status: string;
  dateAndTime: string;
  value: string;
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
  data: Payout[] | undefined;
  total: number;
  isLoading: boolean;
  page: number;
  pageSize: number;
  searchText: string;
  paginationMode: string;
}

// export { Payout, Metadata, PayoutsWithMetadata };
