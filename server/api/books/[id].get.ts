// Mock API endpoint for testing book meta tags
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  // Mock book data for testing
  const mockBook = {
    bookid: id,
    title: "Vue.js设计与实现",
    author: "霍春阳",
    intro: "本书从规格开始，以实现为目标，深入浅出地讲解Vue.js的设计思路。全书共18章，分为四篇，主要讲述响应系统的作用与实现、渲染器的设计与实现、组件化的设计与实现，以及编译器的设计与实现。",
    isbn: "978-7-115-59405-7",
    publisher_name: "人民邮电出版社",
    pubdate: "2022-08-01",
    category: "计算机",
    tags: ["Vue.js", "前端开发", "JavaScript", "响应式系统"],
    price: 89.00,
    region: "中国",
    copyrighter: null,
    translated: 0,
    purchdate: "2023-01-15",
    location: "书房A架",
    total_visits: 156,
    last_visited: "2025-02-28",
    page: 512,
    kword: 320,
    reviews: [
      {
        title: "深入理解Vue.js响应式原理",
        uri: "https://example.com/review1",
        datein: "2023-02-01",
        feature: "/covers/review1.jpg"
      }
    ]
  }
  
  return {
    success: true,
    data: mockBook
  }
})