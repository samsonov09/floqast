import { expect, Page } from "@playwright/test";
export class ApplicationPage {
  constructor(private readonly page: Page) {}
  async open() {
    await this.page.goto("/");
  }
  async register(name: string, email: string) {
    await this.page.getByPlaceholder("Name").fill(name);
    await this.page.getByPlaceholder("Email").fill(email);
    await this.page.getByRole("button", { name: "Register" }).click();
  }
  async expectRegistrationMessage(message: RegExp | string) {
    await expect(this.page.locator("#registration-message")).toHaveText(
      message,
    );
  }
  async createTransaction(amount: string, recipientId = "recipient-456") {
    await this.page.getByPlaceholder("Amount").fill(amount);
    await this.page.getByPlaceholder("Recipient ID").fill(recipientId);
    await this.page.getByRole("button", { name: "Create transaction" }).click();
  }
  async expectTransactionMessage(message: RegExp | string) {
    await expect(this.page.locator("#transaction-message")).toHaveText(message);
  }
}
