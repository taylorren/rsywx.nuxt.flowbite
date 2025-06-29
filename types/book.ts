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
}

export interface RandomBook {
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
  vc: number;
  lvt: string;
  img: string;
};

export interface RecentBook {
  title: string;
  bookid: string;
  vc: number;
  lvt: string;
  city: string;
};

export interface ForgetBook {
  title: string;
  bookid: string;
  vc: number;
  lvt: string;
};

export const defaultForgetBook: ForgetBook = {
  title: "",
  bookid: "",
  vc: 0,
  lvt: ""
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


