import { test, expect } from './fixtures/books.fixture';
import bookTitles from './testData/book-titles';
import pageUrls from './testData/page-urls';
import { books } from './testData/books';
import { BookDetailsPage } from './pages/book-details.page';
import { searchCases } from './testData/search-cases';
import { titlesAscending } from './testData/sorted-book-titles';
import { BooksPage } from './pages/books.page';

test('filters books by partial title and restores results when cleared', async ({ booksPage }) => {
  await booksPage.searchFor('Git');
  await expect(booksPage.bookTitles).toHaveText([books.gitPocketGuide.title]);

  await booksPage.clearSearch();

  await expect(booksPage.bookTitles).toHaveText(bookTitles);
});

test('finds no results when searching by an unknown title', async ({ booksPage }) => {
  await booksPage.searchFor('Unknown');
  await expect(booksPage.bookTitles).toHaveCount(0);
});

test('opens the selected book details and returns to the catalogue', async ({ booksPage, page }) => {
  const selectedBook = books.gitPocketGuide;
  const bookDetailsPage = new BookDetailsPage(page);

  await booksPage.openBook(selectedBook.title);

  await expect(bookDetailsPage.title).toHaveText(selectedBook.title);
  await expect(bookDetailsPage.isbn).toHaveText(selectedBook.isbn);
  await expect(page).toHaveURL(pageUrls.bookUrl(selectedBook.isbn));
  await expect(bookDetailsPage.author).toHaveText(selectedBook.author);
  await expect(bookDetailsPage.publisher).toHaveText(selectedBook.publisher);

  await bookDetailsPage.backToBookStore();
  await expect(booksPage.bookTitles).toHaveText(bookTitles);
});

for (const searchCase of searchCases) {
  test(`searches books by ${searchCase.name}`, async ({ booksPage }) => {
    await booksPage.searchFor(searchCase.query);
    await expect(booksPage.bookTitles).toHaveText(searchCase.expectedTitles);
  });
}

test('returns to the catalogue using browser Back', async ({ booksPage, page }) => {
  const bookDetailsPage = new BookDetailsPage(page);
  const selectedBook = books.gitPocketGuide;

  await booksPage.openBook(selectedBook.title);
  await expect(bookDetailsPage.title).toHaveText(selectedBook.title);

  await page.goBack();

  await expect(page).toHaveURL(pageUrls.booksUrl);
  test.fail(true, 'BUG-001: browser Back leaves book details displayed');
  await expect(booksPage.bookTitles).toHaveText(bookTitles);
});

test('sorts books by title', async ({ booksPage }) => {
  await booksPage.clickTitleHeader();
  await expect(booksPage.bookTitles).toHaveText(titlesAscending);

  await booksPage.clickTitleHeader();
  await expect(booksPage.bookTitles).toHaveText(
    [...titlesAscending].reverse(),
  );
});

test('preserves the search and its results after returning from book details', async ({
  booksPage,
  page,
}) => {
  const selectedBook = books.gitPocketGuide;
  const bookDetailsPage = new BookDetailsPage(page);

  await booksPage.searchFor('Git');
  await expect(booksPage.searchInput).toHaveValue('Git');
  await expect(booksPage.bookTitles).toHaveText([selectedBook.title]);

  await booksPage.openBook(selectedBook.title);
  await expect(bookDetailsPage.title).toHaveText(selectedBook.title);

  await bookDetailsPage.backToBookStore();

  await expect(booksPage.bookTitles).toHaveText([selectedBook.title]);

  test.fail(
    true,
    'BUG-003: returning retains filtered results but clears the search input',
  );
  await expect(booksPage.searchInput).toHaveValue('Git');
});

test('opens a book through a direct link and returns to the catalogue', async ({
  page,
}) => {
  const selectedBook = books.gitPocketGuide;
  const bookDetailsPage = new BookDetailsPage(page);
  const booksPage = new BooksPage(page);

  await page.goto(pageUrls.bookUrl(selectedBook.isbn));

  await expect(bookDetailsPage.title).toHaveText(selectedBook.title);
  await expect(bookDetailsPage.isbn).toHaveText(selectedBook.isbn);

  test.fail(
    true,
    'BUG-002: Back to Book Store fails to open the catalogue after direct entry',
  );
  await bookDetailsPage.backToBookStore();

  await expect(page).toHaveURL(pageUrls.booksUrl);
  await expect(booksPage.bookTitles).toHaveText(bookTitles);
});