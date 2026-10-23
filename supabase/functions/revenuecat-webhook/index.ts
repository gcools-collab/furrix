// Réception des événements RevenueCat (IAP Apple/Google) → table subscriptions.
// SEULE cette fonction écrit le statut Premium. Idempotente via table revenuecat_events.
// Secrets : REVENUECAT_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// App mobile-only : aucun paiement Stripe, 100% In-App Purchase.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supa = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

Deno.serve(async (req) => {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${Deno.env.get('REVENUECAT_WEBHOOK_SECRET')}`) {
    return new Response('unauthorized', { status: 401 });
  }

  const { event } = await req.json();

  // Idempotence
  const { error: dup } = await supa.from('revenuecat_events').insert({ id: event.id });
  if (dup) return new Response('déjà traité', { status: 200 });

  const source = event.store === 'APP_STORE' ? 'apple' : 'google';
  const upsert = (data: Record<string, unknown>) =>
    supa.from('subscriptions').upsert({ user_id: event.app_user_id, source, ...data });

  switch (event.type) {
    case 'INITIAL_PURCHASE':
    case 'RENEWAL':
    case 'TRIAL_CONVERTED':
      await upsert({
        status: event.period_type === 'TRIAL' ? 'trialing' : 'active',
        plan: event.product_id?.includes('annual') ? 'annual' : 'monthly',
        current_period_end: new Date(event.expiration_at_ms).toISOString(),
        revenuecat_id: event.app_user_id,
      });
      break;
    case 'EXPIRATION':
      await supa.from('subscriptions').update({ status: 'canceled' }).eq('user_id', event.app_user_id);
      break;
    case 'BILLING_ISSUE':
      await supa.from('subscriptions').update({ status: 'past_due' }).eq('user_id', event.app_user_id);
      break;
  }
  return new Response('ok', { status: 200 });
});
