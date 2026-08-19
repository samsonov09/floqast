import { randomUUID } from "node:crypto";
export const userData = (overrides: Record<string, unknown> = {}) => ({
  name: "Casey Tester",
  email: `casey.${randomUUID()}@example.test`,
  accountType: "premium",
  ...overrides,
});
export const transactionData = (
  userId: string,
  overrides: Record<string, unknown> = {},
) => ({
  userId,
  amount: 100.5,
  type: "transfer",
  recipientId: randomUUID(),
  ...overrides,
});
