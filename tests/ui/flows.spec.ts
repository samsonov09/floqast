import { test } from "@playwright/test";
import { ApplicationPage } from "../pages/application-page";
test.describe("Fintech UI flows", () => {
  test.beforeEach(async ({ page }) => {
    await new ApplicationPage(page).open();
  });
  test("registers a user successfully", async ({ page }) => {
    const app = new ApplicationPage(page);
    await app.register("Jordan Lee", "jordan@example.test");
    await app.expectRegistrationMessage(/User registered:/);
  });
  test("shows registration validation failure", async ({ page }) => {
    const app = new ApplicationPage(page);
    await app.register("Jordan Lee", "invalid");
    await app.expectRegistrationMessage("Email is invalid");
  });
  test("creates a transaction successfully", async ({ page }) => {
    const app = new ApplicationPage(page);
    await app.register("Jordan Lee", "transaction@example.test");
    await app.createTransaction("25.50");
    await app.expectTransactionMessage(/Transaction created:/);
  });
  test("shows transaction validation failure", async ({ page }) => {
    const app = new ApplicationPage(page);
    await app.register("Jordan Lee", "invalid-transaction@example.test");
    await app.createTransaction("0");
    await app.expectTransactionMessage("Amount must be greater than zero");
  });
});
