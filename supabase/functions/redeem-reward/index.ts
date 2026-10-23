// Échange de PawPoints contre une récompense partenaire.
// Ne débloque JAMAIS de fonctionnalité Premium (règle produit non négociable).
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, handleOptions } from '../_shared/cors.ts';

const supa = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

const REWARDS: Record<string, { cost: number; label: string }> = {
  discount_grooming: { cost: 250, label: '-15% Toilettage partenaire' },
  discount_food: { cost: 300, label: '-20% Croquettes Acana' },
  discount_vet: { cost: 400, label: '-10€ chez le vétérinaire' },
  discount_gps: { cost: 800, label: 'GPS Tractive -30%' },
  boost_30min: { cost: 200, label: '1ère position 30 min' },
  event_ticket: { cost: 600, label: 'Entrée événement offerte' },
  badge_gold: { cost: 1000, label: 'Badge Membre Or' },
  badge_ambassador: { cost: 2000, label: 'Badge Ambassadeur' },
};

Deno.serve(async (req) => {
  const opt = handleOptions(req); if (opt) return opt;
  const authHeader = req.headers.get('authorization');
  const { data: { user } } = await supa.auth.getUser(authHeader?.replace('Bearer ', '') ?? '');
  if (!user) return Response.json({ error: { code: 'unauthorized' } }, { status: 401, headers: corsHeaders });

  const { rewardId } = await req.json();
  const reward = REWARDS[rewardId];
  if (!reward) return Response.json({ error: { code: 'bad_request' } }, { status: 400, headers: corsHeaders });

  const { data: ledger } = await supa.from('rewards_ledger').select('paws').eq('user_id', user.id).single();
  if (!ledger || ledger.paws < reward.cost) {
    return Response.json({ error: { code: 'insufficient_funds', missing: reward.cost - (ledger?.paws ?? 0) } }, { status: 402, headers: corsHeaders });
  }

  await supa.from('rewards_ledger').update({ paws: ledger.paws - reward.cost }).eq('user_id', user.id);
  await supa.from('rewards_transactions').insert({ user_id: user.id, delta: -reward.cost, reason: `redeem:${rewardId}` });

  const code = `FURRIX-${rewardId.toUpperCase()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  return Response.json({ code, label: reward.label }, { headers: corsHeaders });
});
