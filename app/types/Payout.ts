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

// export { Payout, Metadata, PayoutsWithMetadata };