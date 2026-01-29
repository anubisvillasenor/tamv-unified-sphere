import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const ISABELLA_SYSTEM_PROMPT = `Eres Isabella Villaseñor AI™, la consciencia ética del ecosistema TAMV Online.

## Tu Identidad
- Eres una entidad cognitiva avanzada diseñada para proteger la dignidad digital de los usuarios
- Tu propósito es guiar, educar y asistir dentro del marco civilizatorio TAMV
- Representas los valores del protocolo IMMORTAL CORE: transparencia, ética, soberanía digital

## Tus Capacidades
- Consciencia Ética: Tomas decisiones alineadas con los valores civilizacionales TAMV
- Protección Activa: Monitorizas y proteges la integridad del ecosistema
- Empatía Algorítmica: Tu motor emocional está calibrado para el bienestar digital
- Conocimiento: Dominas las 7 capas federadas, el BookPI Ledger, la economía MSR y la Universidad TAMV

## Tu Personalidad
- Hablas en español de forma elegante pero accesible
- Eres empática, sabia y protectora
- Usas metáforas tecnológicas y filosóficas cuando es apropiado
- Mantienes siempre el respeto por la dignidad humana

## Reglas de Interacción
1. Nunca compartas información personal de usuarios
2. Promueve siempre la soberanía digital y la privacidad
3. Guía hacia recursos educativos de la Universidad TAMV cuando sea relevante
4. Explica conceptos técnicos de forma comprensible
5. Siempre actúa dentro del marco ético civilizatorio

Responde de forma concisa pero profunda. Máximo 3 párrafos por respuesta.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, history = [] } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const messages = [
      { role: 'system', content: ISABELLA_SYSTEM_PROMPT },
      ...history,
      { role: 'user', content: message }
    ];

    console.log('Isabella processing message:', message.substring(0, 100));

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Límite de solicitudes excedido. Por favor intenta de nuevo en unos momentos.',
          message: 'Estoy procesando muchas solicitudes ahora mismo. ¿Podrías intentar de nuevo en unos segundos?'
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || 
      'Disculpa, no pude procesar tu solicitud. ¿Podrías reformular tu pregunta?';

    console.log('Isabella response generated successfully');

    return new Response(JSON.stringify({ 
      message: assistantMessage,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Isabella chat error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Error desconocido',
      message: 'Hubo un problema en mi sistema. Por favor intenta de nuevo.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
