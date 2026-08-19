import { expect, test } from "@playwright/test";
import { ApiClient } from "../services/api-client";
import { UserService } from "../services/user-service";
import { userData } from "../support/data-factory";
test.describe("Users API", () => {
  test("creates and retrieves a valid user", async ({ request }) => {
    const users = new UserService(new ApiClient(request));
    const input = userData();
    const created = await users.create(input);
    expect(created.status()).toBe(201);
    const body = await created.json();
    expect(body).toMatchObject(input);
    expect(body.id).toEqual(expect.any(String));
    const retrieved = await users.get(body.id);
    expect(retrieved.status()).toBe(200);
    expect(await retrieved.json()).toEqual(body);
  });
  for (const example of [
    {
      name: "missing required name",
      input: userData({ name: "" }),
      error: "Name is required",
    },
    {
      name: "missing required email",
      input: userData({ email: "" }),
      error: "Email is required",
    },
    {
      name: "invalid email",
      input: userData({ email: "not-an-email" }),
      error: "Email is invalid",
    },
  ])
    test(`rejects ${example.name}`, async ({ request }) => {
      const response = await new UserService(new ApiClient(request)).create(
        example.input,
      );
      expect(response.status()).toBe(400);
      expect(await response.json()).toEqual({ error: example.error });
    });
  test("returns not found for a nonexistent user", async ({ request }) => {
    const response = await new UserService(new ApiClient(request)).get(
      "missing-user",
    );
    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({ error: "User not found" });
  });
  test("rejects an unauthorized user request", async ({ request }) => {
    const response = await new UserService(new ApiClient(request)).create(
      userData(),
      false,
    );
    expect(response.status()).toBe(401);
  });
});
