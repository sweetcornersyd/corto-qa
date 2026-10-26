export default {
  booksUrl: '/books',
  bookUrl: (isbn: string) => `/books?search=${isbn}`,
};