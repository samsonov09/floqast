import express, { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";
type User = { id: string; name: string; email: string; accountType: string };
type Transaction = {
  id: string;
  userId: string;
  amount: number;
  type: string;
  recipientId: string;
};
const app = express();
const users = new Map<string, User>();
const transactions: Transaction[] = [];
const token = process.env.API_TOKEN ?? "assessment-token";
app.use(express.json());
app.use((req, _res, next) => {
  if (req.path.startsWith("/api/")) console.info(`${req.method} ${req.path}`);
  next();
});
function authorize(req: Request, res: Response, next: NextFunction) {
  if (req.header("authorization") !== `Bearer ${token}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api", authorize);
app.post("/api/users", (req, res) => {
  const { name, email, accountType } = req.body ?? {};
  if (!name) return res.status(400).json({ error: "Name is required" });
  if (!email) return res.status(400).json({ error: "Email is required" });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: "Email is invalid" });
  const user: User = {
    id: randomUUID(),
    name,
    email,
    accountType: accountType ?? "standard",
  };
  users.set(user.id, user);
  return res.status(201).json(user);
});
app.get("/api/users/:id", (req, res) => {
  const user = users.get(req.params.id);
  return user
    ? res.json(user)
    : res.status(404).json({ error: "User not found" });
});
app.post("/api/transactions", (req, res) => {
  const { userId, amount, type, recipientId } = req.body ?? {};
  if (!users.has(userId))
    return res.status(404).json({ error: "User not found" });
  if (typeof amount !== "number" || amount <= 0)
    return res.status(400).json({ error: "Amount must be greater than zero" });
  if (!type || !recipientId)
    return res.status(400).json({ error: "Type and recipient are required" });
  const transaction: Transaction = {
    id: randomUUID(),
    userId,
    amount,
    type,
    recipientId,
  };
  transactions.push(transaction);
  return res.status(201).json(transaction);
});
app.get("/api/transactions/:userId", (req, res) => {
  if (!users.has(req.params.userId))
    return res.status(404).json({ error: "User not found" });
  return res.json(
    transactions.filter((item) => item.userId === req.params.userId),
  );
});
app.get("/", (_req, res) =>
  res
    .type("html")
    .send(
      `<!doctype html><html><head><meta charset="utf-8"><title>Fintech Test Harness</title><style>body{font:16px system-ui;max-width:720px;margin:2rem auto}form{display:grid;gap:.6rem;margin-bottom:2rem}input,select,button{padding:.55rem}.message{min-height:1.5rem}[data-kind=error]{color:#a00}[data-kind=success]{color:#075}</style></head><body><h1>Fintech Test Harness</h1><section><h2>Register user</h2><form id="registration"><input name="name" placeholder="Name"><input name="email" placeholder="Email"><select name="accountType"><option value="premium">Premium</option><option value="standard">Standard</option></select><button>Register</button></form><p id="registration-message" class="message" role="status"></p></section><section><h2>Create transaction</h2><form id="transaction"><input name="userId" placeholder="User ID"><input name="amount" placeholder="Amount"><select name="type"><option value="transfer">Transfer</option></select><input name="recipientId" placeholder="Recipient ID"><button>Create transaction</button></form><p id="transaction-message" class="message" role="status"></p></section><script>const token='${token}';async function submit(formId,path,messageId,transform){const form=document.querySelector(formId);form.addEventListener('submit',async event=>{event.preventDefault();const message=document.querySelector(messageId);const body=transform(Object.fromEntries(new FormData(form)));const response=await fetch(path,{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+token},body:JSON.stringify(body)});const data=await response.json();message.dataset.kind=response.ok?'success':'error';message.textContent=response.ok?(path.includes('users')?'User registered: '+data.id:'Transaction created: '+data.id):data.error;if(response.ok&&data.id&&path.includes('users'))document.querySelector('[name=userId]').value=data.id;});}submit('#registration','/api/users','#registration-message',x=>x);submit('#transaction','/api/transactions','#transaction-message',x=>({...x,amount:Number(x.amount)}));</script></body></html>`,
    ),
);
app.listen(Number(process.env.PORT ?? 4173), "127.0.0.1", () =>
  console.info("Mock application listening"),
);
