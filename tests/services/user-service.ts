import { ApiClient } from "./api-client";
export class UserService {
  constructor(private readonly client: ApiClient) {}
  create(data: unknown, authorized = true) {
    return this.client.send("post", "/api/users", data, authorized);
  }
  get(id: string) {
    return this.client.send("get", `/api/users/${id}`);
  }
}
