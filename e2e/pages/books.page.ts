import { type Locator, type Page } from "@playwright/test";
import pageUrls from "../testData/page-urls";

export class BooksPage {
  readonly searchInput: Locator;
  readonly bookTitles: Locator;

  constructor(private readonly page: Page) {
    this.searchInput = page.getByPlaceholder("Type to search");
    this.bookTitles = page.getByRole("table").getByRole("link");
  }

  async open() {
    await this.page.goto(pageUrls.booksUrl, {
      waitUntil: "domcontentloaded",
    });
  }

  async searchFor(term: string) {
    await this.searchInput.fill(term);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async openBook(title: string) {
    await this.bookTitles.filter({ hasText: title }).click();
  }

  async clickTitleHeader() {
    await this.page.getByRole("columnheader", { name: "Title" }).click();
  }
}
