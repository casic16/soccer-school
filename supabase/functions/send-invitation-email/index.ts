import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const APP_URL = Deno.env.get('APP_URL') || 'https://fariki.vercel.app'

serve(async (req) => {
  try {
    const { record } = await req.json()

    const { email, token, role } = record

    const registerLink = `${APP_URL}/register?token=${token}`

    const roleLabel = {
      parent: 'Parent',
      player: 'Joueur',
      coach: 'Coach',
      admin: 'Administrateur',
    }[role] || role

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Fariki <onboarding@resend.dev>',
        to: email,
        subject: 'Vous avez été invité à rejoindre Fariki',
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #16a34a;">Bienvenue sur Fariki 🎉</h2>
            <p>Vous avez été invité à rejoindre Fariki en tant que <strong>${roleLabel}</strong>.</p>
            <p>Cliquez sur le bouton ci-dessous pour créer votre compte :</p>
            <a href="${registerLink}" style="
              display: inline-block;
              background-color: #16a34a;
              color: white;
              padding: 12px 24px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: bold;
              margin: 16px 0;
            ">
              Créer mon compte
            </a>
            <p style="color: #6b7280; font-size: 14px;">
              Ce lien expire dans 7 jours. Si vous n'attendiez pas cette invitation, ignorez cet email.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="color: #9ca3af; font-size: 12px;">Fariki — Gestion d'école de soccer</p>
          </div>
        `,
      }),
    })

    const data = await res.json()

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})