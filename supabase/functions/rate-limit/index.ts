// Vérification anti-abus multi-clés (IP + user + fingerprint) — voir doc §7.
// À appeler en tout début de toute action sensible (signup, swipe, message, report).
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, handleOptions } from '../_shared/cors.ts';

const supa = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

const LIMITS: Record<string, { max: number; windowHours: number; key: 'ip' | 'user_id' | 'fingerprint' }[]> = {
  signup:  [{ max: 3, windowHours: 24, key: 'ip' }, { max: 3, windowHours: 24, key: 'fingerprint' }],
  swipe:   [{ max: 5, windowHours: 24, key: 'user_id' }],
  message: [{ max: 200, windowHours: 1, key: 'user_id' }],
  report:  [{ max: 10, windowHours: 24, key: 'user_id' }],
};

Deno.serve(async (req) => {
  const opt = handleOptions(req); if (opt) return opt;
  const { bucket, userId, fingerprint } = await req.json();
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const rules = LIMITS[bucket];
  if (!rules) return Response.json({ error: { code: 'bad_request' } }, { status: 400, headers: corsHeaders });

  const keys = [`ip:${ip}`, userId ? `user:${userId}` : null, fingerprint ? `fp:${fingerprint}` : null].filter(Boolean);
  const { data: blocked } = await supa.from('blocked_entities').select('key').in('key', keys as string[]).gt('until', new Date().toISOString());
  if (blocked && blocked.length > 0) {
    return Response.json({ allowed: false, reason: 'blocked' }, { status: 429, headers: corsHeaders });
  }

  for (const rule of rules) {
    const value = rule.key === 'ip' ? ip : rule.key === 'user_id' ? userId : fingerprint;
    if (!value) continue;
    const since = new Date(Date.now() - rule.windowHours * 3600 * 1000).toISOString();
    const { count } = await supa.from('rate_limit_events')
      .select('*', { count: 'exact', head: true })
      .eq('bucket', bucket).eq(rule.key, value).gt('created_at', since);
    if ((count ?? 0) >= rule.max) {
      return Response.json({ allowed: false, reason: 'rate_limited', retryAfterHours: rule.windowHours }, { status: 429, headers: corsHeaders });
    }
  }

  await supa.from('rate_limit_events').insert({ bucket, ip, user_id: userId ?? null, fingerprint: fingerprint ?? null });
  return Response.json({ allowed: true }, { headers: corsHeaders });
});
