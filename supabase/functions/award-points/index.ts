// Attribution SERVEUR des PawPoints (jamais côté client — anti-triche).
// Barème fixe défini ici, jamais envoyé par le client.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, handleOptions } from '../_shared/cors.ts';

const supa = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

const REWARDS: Record<string, number> = {
  daily_login: 10,
  complete_profile: 50,
  new_match: 15,
  referral: 100,
  help_lost_pet: 80,
  community_post: 20,
};

Deno.serve(async (req) => {
  const opt = handleOptions(req); if (opt) return opt;
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return Response.json({ error: { code: 'unauthorized' } }, { status: 401, headers: corsHeaders });

  const { data: { user } } = await supa.auth.getUser(authHeader.replace('Bearer ', ''));
  if (!user) return Response.json({ error: { code: 'unauthorized' } }, { status: 401, headers: corsHeaders });

  const { action } = await req.json();
  const delta = REWARDS[action];
  if (!delta) return Response.json({ error: { code: 'bad_request', message: 'action inconnue' } }, { status: 400, headers: corsHeaders });

  await supa.from('rewards_transactions').insert({ user_id: user.id, delta, reason: action });

  const { data, error } = await supa.rpc('increment_paws', { p_user: user.id, p_delta: delta });
  if (error) return Response.json({ error: { code: 'db_error', message: error.message } }, { status: 500, headers: corsHeaders });

  return Response.json({ paws: data.paws, xp: data.xp, level: data.level }, { headers: corsHeaders });
});
