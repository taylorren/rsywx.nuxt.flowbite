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
  title: string;           // This is the review title
  datein: string;
  uri: string;
  feature: string;
  bookid: string;
  book_title: string;      // This is the book title
  cover_uri: string;
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