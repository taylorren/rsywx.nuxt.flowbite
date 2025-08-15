export interface ReadingSummary {
  books_read: number;
  reviews_written: number;
  reading_period: {
    earliest_date: string;
    latest_date: string;
    total_days: number;
  };
}

// Legacy interface for backward compatibility
export interface LegacyReadingSummary {
  hc: number;
  rc: number;
}
export interface LatestReading {
  hid: number;
  bid: number;
  bookid: string;
  title: string;
  author: string;
  reviewtitle: string;
  create_at: string;
  cover_uri: string;
  reviews_count: number;
}

// Legacy interface for backward compatibility
export interface LegacyLatestReading {
  hid: number;
  bid: number;
  reviewtitle: string;
  create_at: string;
  display: number;
  id: number;
  title: string;
  datein: string;
  uri: string;
  feature: string;
  book_reviewcol: null | any;
  book_title: string;
  book_bookid: string;
}