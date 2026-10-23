export const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('APP_URL') ?? '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
export function handleOptions(req: Request) {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  return null;
}
