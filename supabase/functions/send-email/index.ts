// Emails transactionnels via Brevo. Secrets : BREVO_API_KEY
import { corsHeaders, handleOptions } from '../_shared/cors.ts';

const TEMPLATES: Record<string, { subject: string; html: (v: Record<string, string>) => string }> = {
  welcome: {
    subject: 'Bienvenue sur Furrix 🐾',
    html: (v) => `<h2>Bienvenue ${v.name ?? ''} !</h2><p>Le profil de votre compagnon est prêt. Trouvez-lui un ami dès maintenant.</p>`,
  },
  appointment: {
    subject: 'Votre RDV vétérinaire est confirmé',
    html: (v) => `<p>RDV confirmé chez <b>${v.vet}</b> le <b>${v.slot}</b>.</p>`,
  },
};

Deno.serve(async (req) => {
  const opt = handleOptions(req); if (opt) return opt;
  const { template, to, vars = {} } = await req.json();
  const t = TEMPLATES[template];
  if (!t || !to) return Response.json({ error: { code: 'bad_request' } }, { status: 400, headers: corsHeaders });

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': Deno.env.get('BREVO_API_KEY')!, 'content-type': 'application/json' },
    body: JSON.stringify({
      sender: { name: 'Furrix', email: 'bonjour@furrix.fr' },
      to: [{ email: to }],
      subject: t.subject,
      htmlContent: t.html(vars),
    }),
  });
  if (!res.ok) return Response.json({ error: { code: 'brevo_error' } }, { status: 502, headers: corsHeaders });
  return Response.json({ ok: true }, { headers: corsHeaders });
});
