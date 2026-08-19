import { APIRequestContext, expect, test } from "@playwright/test";
import { ApiClient } from "../services/api-client";
import { TransactionService } from "../services/transaction-service";
import { UserService } from "../services/user-service";
import { transactionData, userData } from "../support/data-factory";
async function createUser(request: APIRequestContext) {
  const response = await new UserService(new ApiClient(request)).create(
    userData(),
  );
  expect(response.status()).toBe(201);
  return (await response.json()).id as string;
}
test.describe("Transactions API", () => {
  test("creates and retrieves a transaction by user", async ({ request }) => {
    const userId = await createUser(request);
    const transactions = new TransactionService(new ApiClient(request));
    const input = transactionData(userId);
    const created = await transactions.create(input);
    expect(created.status()).toBe(201);
    const body = await created.json();
    expect(body).toMatchObject(input);
    const retrieved = await transactions.getByUser(userId);
    expect(retrieved.status()).toBe(200);
    expect(await retrieved.json()).toContainEqual(body);
  });
  test("rejects an invalid amount", async ({ request }) => {
    const userId = await createUser(request);
    const response = await new TransactionService(
      new ApiClient(request),
    ).create(transactionData(userId, { amount: 0 }));
    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({
      error: "Amount must be greater than zero",
    });
  });
  test("rejects a transaction for a nonexistent user", async ({ request }) => {
    const response = await new TransactionService(
      new ApiClient(request),
    ).create(transactionData("missing-user"));
    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ error: "User not found" });
  });
  test("rejects an unauthorized transaction request", async ({ request }) => {
    const response = await new TransactionService(
      new ApiClient(request),
    ).create(transactionData("any-user"), false);
    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
  });
});
