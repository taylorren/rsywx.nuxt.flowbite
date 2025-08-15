// filepath: types/book.ts
export interface Book {
  id: number;
  place: number;
  publisher: number;
  bookid: string;
  title: string;
  author: string;
  region: string;
  copyrighter: string;
  translated: number;
  purchdate: string;
  price: number;
  pubdate: string;
  printdate: string;
  ver: string;
  deco: string;
  kword: number;
  page: number;
  isbn: string;
  category: string;
  ol: string;
  intro: string;
  instock: number;
  location: string;
  pu_name: string;
  pu_place: string;
  vc: number;
  lvt: string;
  reviews: Review[];
}

export interface Review {
  rt: string;
  datein: string;
  uri: string;
  bt: string;
}

export interface BooksSummary {
  bc: number;
  pc: string;
  wc: string;
  vc: number;
}

export interface RandomBook {
  id: number;
  bookid: string;
  title: string;
  author: string;
  region: string;
  publisher_name: string;
  place_name: string;
  cover_uri: string;
  total_visits: number;
  last_visited: string;
};

export interface LatestBook {
  id: number;
  bookid: string;
  title: string;
  author: string;
  cover_uri: string;
  translated: number;
  copyrighter: string;
  region: string;
  location: string;
  purchdate: string;
  price: number;
};

export interface RecentBook {
  id: number;
  bookid: string;
  title: string;
  author: string;
  translated: boolean;
  copyrighter: string | null;
  region: string;
  location: string;
  cover_uri: string;
  last_visited: string;
  visit_country: string;
};

export interface ForgetBook {
  id: number;
  bookid: string;
  title: string;
  author: string;
  translated: boolean;
  copyrighter: string | null;
  region: string;
  location: string;
  cover_uri: string;
  last_visited: string;
  days_since_visit: number;
};

export const defaultForgetBook: ForgetBook = {
  id: 0,
  bookid: "",
  title: "",
  author: "",
  translated: false,
  copyrighter: null,
  region: "",
  location: "",
  cover_uri: "",
  last_visited: "",
  days_since_visit: 0
};

// 根据/books/today接口返回的数据创建的类型
export interface TodayBook {
  id: number;
  place: number;
  publisher: number;
  bookid: string;
  title: string;
  author: string;
  region: string;
  copyrighter: string;
  translated: number;
  purchdate: string;
  price: number;
  pubdate: string;
  printdate: string;
  ver: string;
  deco: string;
  kword: number;
  page: number;
  isbn: string;
  category: string;
  ol: string;
  intro: string;
  instock: number;
  location: string;
}

// 根据/book/tags/{bookid}接口返回的数据创建的类型
export type BookTags = string[];


