// Contact form endpoint. For now it validates and logs the request.
// To deliver messages, send `data` to email (SMTP/Resend) or a Telegram bot here,
// reading credentials from environment variables (.env.local).

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  services?: string[];
  budget?: string;
  message?: string;
};

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const data = {
    name: clip(body.name, 120),
    email: clip(body.email, 200),
    phone: clip(body.phone, 40),
    company: clip(body.company, 160),
    services: Array.isArray(body.services) ? body.services.map((s) => clip(s, 60)).slice(0, 10) : [],
    budget: clip(body.budget, 40),
    message: clip(body.message, 4000),
  };

  if (data.name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.message.length < 10) {
    return Response.json({ ok: false, error: "Missing or invalid fields" }, { status: 422 });
  }

  console.info("[contact] new request", { ...data, receivedAt: new Date().toISOString() });
  return Response.json({ ok: true });
}
