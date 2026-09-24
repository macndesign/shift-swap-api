# shift-swap-api

API de troca de plantões com autenticação via [Better Auth](https://www.better-auth.com), Postgres e suporte a dois tipos de usuário: `SUPERVISOR` e `EMPLOYEE`.

## Desenvolvimento local

1. Instale as dependências:

   ```bash
   bun install
   ```

2. Copie o arquivo de variáveis de ambiente e ajuste os valores (gere `BETTER_AUTH_SECRET` com `openssl rand -base64 32`):

   ```bash
   cp .env.example .env
   ```

3. Suba apenas o Postgres (ou use um Postgres já existente):

   ```bash
   docker compose up -d postgres
   ```

4. Aplique o schema do Better Auth no banco:

   ```bash
   bun run auth:migrate
   ```

5. Rode a API:

   ```bash
   bun run dev
   ```

A API sobe em `http://localhost:3000`.

## Docker

Para rodar tudo (API + Postgres) via Docker:

```bash
export BETTER_AUTH_SECRET=$(openssl rand -base64 32)
docker compose up --build
```

O container da API roda a migration do Better Auth automaticamente antes de iniciar o servidor.

## Endpoints

- `GET /health` — health-check, retorna `{ status: "ok", timestamp }`.
- `POST /api/auth/sign-up/email` — cria um usuário. O corpo deve incluir `email`, `password`, `name` e `role` (`"SUPERVISOR"` ou `"EMPLOYEE"`), este último obrigatório para diferenciar os dois tipos de usuário.
- `POST /api/auth/sign-in/email` — login.
- Demais rotas expostas pelo Better Auth ficam sob o prefixo `/api/auth/*` (ver [documentação](https://www.better-auth.com/docs)).

## Integração com o frontend

O frontend deve ser adicionado em `CORS_ORIGIN` (lista separada por vírgula) e usar `credentials: "include"` nas chamadas, já que a sessão é baseada em cookies. Como o campo `role` é uma extensão do schema padrão, o client do Better Auth no frontend precisa do plugin `inferAdditionalFields`:

```ts
import { createAuthClient } from "better-auth/client";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
  plugins: [
    inferAdditionalFields({
      user: { role: { type: "string" } },
    }),
  ],
});
```

This project was created using `bun init` in bun v1.4.2. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
