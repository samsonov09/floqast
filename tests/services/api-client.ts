import { APIRequestContext, APIResponse, test } from "@playwright/test";
export class ApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly apiToken = process.env.API_TOKEN ?? "assessment-token",
  ) {}
  async send(
    method: "get" | "post",
    path: string,
    data?: unknown,
    authorized = true,
  ): Promise<APIResponse> {
    const response = await this.request[method](path, {
      data,
      headers: authorized ? { authorization: `Bearer ${this.apiToken}` } : {},
    });
    await test.info().attach(`API ${method.toUpperCase()} ${path}`, {
      body: JSON.stringify(
        { status: response.status(), response: await response.text() },
        null,
        2,
      ),
      contentType: "application/json",
    });
    return response;
  }
}
