import { test as base, expect } from '@playwright/test';
import { BooksPage } from '../pages/books.page';
import bookTitles from '../testData/book-titles';

type BooksFixtures = {
  booksPage: BooksPage;
};

export const test = base.extend<BooksFixtures>({
  booksPage: async ({ page }, use) => {
    const booksPage = new BooksPage(page);

    await booksPage.open();
    await expect(booksPage.bookTitles).toHaveText(bookTitles);

    await use(booksPage);
  },
});

export { expect };