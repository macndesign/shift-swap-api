import { auth } from "./lib/auth";

const port = Number(process.env.PORT ?? 3000);

const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin",
  };

  if (origin && allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);
    const origin = req.headers.get("origin");
    const cors = corsHeaders(origin);

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (url.pathname === "/health") {
      return Response.json({ status: "ok", timestamp: new Date().toISOString() }, { headers: cors });
    }

    if (url.pathname.startsWith("/api/auth")) {
      const response = await auth.handler(req);
      for (const [key, value] of Object.entries(cors)) {
        response.headers.set(key, value);
      }
      return response;
    }

    return new Response("Not Found", { status: 404, headers: cors });
  },
});

console.log(`shift-swap-api listening on port ${port}`);
