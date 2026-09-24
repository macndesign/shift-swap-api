import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./lib/auth";
import { requireAuth, requireSupervisor } from "./lib/session-middleware";
import { listarTurnos } from "./lib/shift-swap";

const port = Number(process.env.PORT ?? 3000);

const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = new Hono();

app.use(
  "*",
  cors({
    origin: allowedOrigins,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

app.get("/turnos", requireAuth, requireSupervisor, async (c) => {
  const result = await listarTurnos.execute();

  if (result.isFailure) {
    return c.json({ error: result.error }, 500);
  }

  const turnos = result.getValue().map((turno) => ({
    id: turno.id,
    data: turno.data,
    horaInicio: turno.horaInicio,
    horaFim: turno.horaFim,
    funcionarioId: turno.funcionarioId,
  }));

  return c.json({ turnos });
});

console.log(`shift-swap-api listening on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
