import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  try {
    const { token, full_name, password } = await req.json()

    // 1. Vérifier l'invitation
    const { data: invitation, error: invError } = await supabaseAdmin
      .from('invitations')
      .select('*')
      .eq('token', token)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()

    if (invError || !invitation) {
      return new Response(
        JSON.stringify({ error: 'Invitation invalide ou expirée.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 2. Créer le compte Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: invitation.email,
      password,
      email_confirm: true,
    })

    if (authError) {
      return new Response(
        JSON.stringify({ error: authError.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 3. Créer le profil utilisateur
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        school_id: invitation.school_id,
        full_name,
        email: invitation.email,
        role: invitation.role,
      })

    if (profileError) {
      return new Response(
        JSON.stringify({ error: profileError.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // 4. Marquer l'invitation comme acceptée
    await supabaseAdmin
      .from('invitations')
      .update({ accepted_at: new Date().toISOString() })
      .eq('token', token)

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})