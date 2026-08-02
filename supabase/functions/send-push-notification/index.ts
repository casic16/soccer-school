import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { event_id, team_id, title, body } = await req.json()

    // Récupère les tokens push des parents et joueurs de l'équipe
    const { data: players } = await supabaseAdmin
      .from('players')
      .select('user_id')
      .eq('team_id', team_id)

    if (!players || players.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const userIds = players.map(p => p.user_id).filter(Boolean)

    const { data: users } = await supabaseAdmin
      .from('users')
      .select('id, push_token')
      .in('id', userIds)
      .not('push_token', 'is', null)

    if (!users || users.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Envoie les notifications via Expo Push API
    const messages = users.map(user => ({
      to: user.push_token,
      sound: 'default',
      title: title || 'Fariki',
      body: body || 'Nouvel événement disponible',
      data: { event_id, team_id },
      channelId: 'default',
    }))

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    })

    const result = await response.json()
    console.log('Push result:', JSON.stringify(result))

    // Sauvegarde les notifications dans la DB
    const notifications = users.map(user => ({
      user_id: user.id,
      event_id,
      message: body || 'Nouvel événement disponible',
      is_read: false,
    }))

    await supabaseAdmin.from('notifications').insert(notifications)

    return new Response(
      JSON.stringify({ success: true, sent: messages.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('Erreur:', err)
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})