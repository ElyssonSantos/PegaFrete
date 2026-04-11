import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const FCM_URL = "https://fcm.googleapis.com/fcm/send"
const FCM_SERVER_KEY = "SUA_FCM_SERVER_KEY_AQUI" // Obtenha nas configurações do Firebase Cloud Messaging (Legacy)

serve(async (req) => {
  try {
    const { userId, title, body, data } = await req.json()

    // 1. Buscar tokens do usuário no Supabase
    // (Você precisará configurar o cliente Supabase aqui também se for rodar fora do contexto padrão)
    
    // Simulação de payload de envio FCM
    const message = {
      to: "TOKEN_DO_USUARIO", // Buscar da tabela user_push_tokens
      notification: {
        title,
        body,
        icon: "/pwa-192x192.png",
      },
      data: data || {}
    }

    const response = await fetch(FCM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `key=${FCM_SERVER_KEY}`
      },
      body: JSON.stringify(message)
    })

    const result = await response.json()
    return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
