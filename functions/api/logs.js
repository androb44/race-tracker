// Cloudflare Pages Function — handles GET and PUT for shared logs
// Bound to KV namespace "RACE_LOGS" in Cloudflare dashboard

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const key = url.searchParams.get("key");

  if (!key) {
    return new Response(JSON.stringify({ error: "Missing key" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const value = await context.env.RACE_LOGS.get(key);
  return new Response(JSON.stringify({ key, value: value ? JSON.parse(value) : {} }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPut(context) {
  const body = await context.request.json();
  const { key, value } = body;

  if (!key || value === undefined) {
    return new Response(JSON.stringify({ error: "Missing key or value" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  await context.env.RACE_LOGS.put(key, JSON.stringify(value));
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestDelete(context) {
  const url = new URL(context.request.url);
  const key = url.searchParams.get("key");

  if (!key) {
    return new Response(JSON.stringify({ error: "Missing key" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  await context.env.RACE_LOGS.delete(key);
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
