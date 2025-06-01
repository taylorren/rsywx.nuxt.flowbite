export interface ReadingSummary {
  hc: number;
  rc: number;
}
export interface LatestReading {
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
  book_reviewcol: null | any; // Assuming it can be null or another type
  book_title: string;
  book_bookid: string;
}