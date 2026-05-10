import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use('*', logger(console.log));
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ── Helper: validate token and return userId ──────────────────────────────────
async function getAuthUserId(authHeader: string | null): Promise<string | null> {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    );
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return user.id;
  } catch (e) {
    console.log('Auth error:', e);
    return null;
  }
}

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/make-server-191b52e6/health", (c) => {
  return c.json({ status: "ok" });
});

// ── Auth: Sign Up ──────────────────────────────────────────────────────────────
// Uses service role to auto-confirm email (no email server required)
app.post("/make-server-191b52e6/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || email.split('@')[0] },
      // Automatically confirm email since no email server is configured
      email_confirm: true,
    });
    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }
    return c.json({ user: data.user });
  } catch (e) {
    console.log('Signup exception:', e);
    return c.json({ error: `Signup failed: ${e}` }, 500);
  }
});

// ── Auth: Sign In ──────────────────────────────────────────────────────────────
app.post("/make-server-191b52e6/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    );
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.log('Signin error:', error);
      return c.json({ error: error.message }, 401);
    }
    return c.json({
      user:          data.user,
      access_token:  data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at:    data.session.expires_at,
    });
  } catch (e) {
    console.log('Signin exception:', e);
    return c.json({ error: `Sign in failed: ${e}` }, 500);
  }
});

// ── Trips: Get all for current user ──────────────────────────────────────────
app.get("/make-server-191b52e6/trips", async (c) => {
  const userId = await getAuthUserId(c.req.header('Authorization'));
  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  try {
    const trips = await kv.getByPrefix(`trip:${userId}:`);
    return c.json({ trips: trips || [] });
  } catch (e) {
    console.log('Get trips error:', e);
    return c.json({ error: `Failed to fetch trips: ${e}` }, 500);
  }
});

// ── Trips: Create ─────────────────────────────────────────────────────────────
app.post("/make-server-191b52e6/trips", async (c) => {
  const userId = await getAuthUserId(c.req.header('Authorization'));
  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  try {
    const trip = await c.req.json();
    if (!trip.id) return c.json({ error: "Trip must have an id" }, 400);
    await kv.set(`trip:${userId}:${trip.id}`, trip);
    return c.json({ trip });
  } catch (e) {
    console.log('Create trip error:', e);
    return c.json({ error: `Failed to create trip: ${e}` }, 500);
  }
});

// ── Trips: Update ─────────────────────────────────────────────────────────────
app.put("/make-server-191b52e6/trips/:id", async (c) => {
  const userId = await getAuthUserId(c.req.header('Authorization'));
  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  try {
    const tripId = c.req.param('id');
    const trip = await c.req.json();
    await kv.set(`trip:${userId}:${tripId}`, trip);
    return c.json({ trip });
  } catch (e) {
    console.log('Update trip error:', e);
    return c.json({ error: `Failed to update trip: ${e}` }, 500);
  }
});

// ── Trips: Delete ─────────────────────────────────────────────────────────────
app.delete("/make-server-191b52e6/trips/:id", async (c) => {
  const userId = await getAuthUserId(c.req.header('Authorization'));
  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  try {
    const tripId = c.req.param('id');
    await kv.del(`trip:${userId}:${tripId}`);
    return c.json({ success: true });
  } catch (e) {
    console.log('Delete trip error:', e);
    return c.json({ error: `Failed to delete trip: ${e}` }, 500);
  }
});

// ── Profile: Get ──────────────────────────────────────────────────────────────
app.get("/make-server-191b52e6/profile", async (c) => {
  const userId = await getAuthUserId(c.req.header('Authorization'));
  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  try {
    const profile = await kv.get(`profile:${userId}`);
    return c.json({ profile: profile || null });
  } catch (e) {
    console.log('Get profile error:', e);
    return c.json({ error: `Failed to fetch profile: ${e}` }, 500);
  }
});

// ── Profile: Update ───────────────────────────────────────────────────────────
app.put("/make-server-191b52e6/profile", async (c) => {
  const userId = await getAuthUserId(c.req.header('Authorization'));
  if (!userId) return c.json({ error: "Unauthorized" }, 401);

  try {
    const profile = await c.req.json();
    await kv.set(`profile:${userId}`, profile);
    return c.json({ profile });
  } catch (e) {
    console.log('Update profile error:', e);
    return c.json({ error: `Failed to update profile: ${e}` }, 500);
  }
});

Deno.serve(app.fetch);