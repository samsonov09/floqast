import { ApiClient } from "./api-client";
export class TransactionService {
  constructor(private readonly client: ApiClient) {}
  create(data: unknown, authorized = true) {
    return this.client.send("post", "/api/transactions", data, authorized);
  }
  getByUser(userId: string) {
    return this.client.send("get", `/api/transactions/${userId}`);
  }
}
