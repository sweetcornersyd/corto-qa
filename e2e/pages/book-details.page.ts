import { type Locator, type Page } from '@playwright/test';

export class BookDetailsPage {
  readonly title: Locator;
  readonly isbn: Locator;
  readonly author: Locator;
  readonly publisher: Locator;

  constructor(private readonly page: Page) {
    this.title = page.locator('#title-wrapper #userName-value');
    this.isbn = page.locator('#ISBN-wrapper #userName-value');
    this.author = page.locator('#author-wrapper #userName-value');
    this.publisher = page.locator('#publisher-wrapper #userName-value');
  }

  async backToBookStore() {
    await this.page
      .getByRole('button', { name: 'Back To Book Store', exact: true })
      .click();
  }
}
