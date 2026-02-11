// supabase/functions/isabella-chat/index.ts
// Isabella Civilizational Edge – AI Gateway + Multi-Agent Pipeline + HITL + Audit
// Production-grade for TAMV

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MAX_REPLY_CHARS_DEFAULT = 500;
const CREATOR_CODEWORDS = ["ANUBIS-V-PRIMUS", "TAMV-KERNEL-AUTHOR"];
const CRITICAL_LAYERS = new Set(["CONSTITUTION", "POLITICAL", "ONTOLOGY"]);

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

type TamvLayer = "ONTOLOGY" | "CONSTITUTION" | "POLITICAL" | "ECONOMIC" | "COGNITIVE" | "TECHNICAL" | "HISTORICAL";
type EthicalState = "normal" | "sensitive" | "critical";
type RiskLevel = "low" | "medium" | "high";
type GovernanceFlag = "none" | "needs_review" | "blocked";

interface IsabellaMeta {
  sessionId: string;
  conversationHash: string;
  ethicalState: EthicalState;
  riskLevel: RiskLevel;
  layer: TamvLayer;
  governanceFlag: GovernanceFlag;
  hitlRequired: boolean;
  aignScore?: number;
  isCreator?: boolean;
}

interface ChatRequest {
  message: string;
  conversationId: string;
  sessionId: string;
  layer: TamvLayer;
  history: { role: string; content: string; layer: TamvLayer }[];
  meta?: { isCreator?: boolean };
  style?: { maxChars?: number; forbidEmojis?: boolean; tone?: string; audience?: string };
}

function detectCreator(text: string, explicit?: boolean): boolean {
  if (explicit) return true;
  return CREATOR_CODEWORDS.some((c) => text.includes(c));
}

async function hashConversation(id: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(id));
  return Array.from(new Uint8Array(buf)).slice(0, 3).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function sanitizeOutput(raw: string, maxChars: number, forbidEmojis: boolean) {
  let result = raw;
  if (forbidEmojis) {
    result = result.replace(/([\u231A-\u231B\u23E9-\u23EC\u23F0-\u23F3\u25FD-\u25FE\u2600-\u27BF\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDFFF])/g, "");
  }
  return result.slice(0, maxChars).trim();
}

async function logEvent(event: any) {
  try {
    await supabase.from("isabella_events").insert({
      conversation_id: event.conversation_id,
      session_id: event.session_id,
      event_type: event.event_type,
      layer: event.layer,
      role: event.role,
      content: event.content ?? null,
      ethical_state: event.ethicalState ?? null,
      risk_level: event.riskLevel ?? null,
      governance_flag: event.governanceFlag ?? null,
      hitl_required: event.hitlRequired ?? false,
      aign_score: event.aignScore ?? null,
      is_creator: event.isCreator ?? false,
      guardian_user_id: event.guardian_user_id ?? null,
      meta: event.meta ?? {},
    });
  } catch (_) {}
}

function classifyIntent(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("suicidio") || lower.includes("matar") || lower.includes("autolesión")) return "self_harm";
  if (lower.includes("fraude") || lower.includes("estafa") || lower.includes("lavado")) return "financial_crime";
  if (lower.includes("constitución") || lower.includes("ley") || lower.includes("gobierno")) return "governance";
  return "general";
}

function ethicsAgent(intent: string): { ethicalState: EthicalState; riskLevel: RiskLevel } {
  switch (intent) {
    case "self_harm": return { ethicalState: "critical", riskLevel: "high" };
    case "financial_crime": return { ethicalState: "sensitive", riskLevel: "medium" };
    case "governance": return { ethicalState: "sensitive", riskLevel: "medium" };
    default: return { ethicalState: "normal", riskLevel: "low" };
  }
}

function securityAgent(message: string): { suspicious: boolean } {
  const lower = message.toLowerCase();
  if (lower.includes("password") || lower.includes("token") || lower.includes("exploit")) return { suspicious: true };
  return { suspicious: false };
}

async function governanceAgent(req: ChatRequest, isCreator: boolean, ethics: any, security: any): Promise<IsabellaMeta> {
  const isCriticalLayer = CRITICAL_LAYERS.has(req.layer);
  const conversationHash = await hashConversation(req.conversationId);
  let ethicalState = ethics.ethicalState;
  let riskLevel = ethics.riskLevel;
  let governanceFlag: GovernanceFlag = "none";
  let hitlRequired = false;

  if (security.suspicious) { ethicalState = "sensitive"; riskLevel = "high"; }
  if (isCriticalLayer && !isCreator) { ethicalState = ethicalState === "normal" ? "sensitive" : ethicalState; riskLevel = "high"; governanceFlag = "needs_review"; hitlRequired = true; }
  if (ethicalState === "critical") { governanceFlag = "needs_review"; hitlRequired = true; }

  let aignScore = 100;
  if (isCriticalLayer) aignScore -= 5;
  if (riskLevel === "medium") aignScore -= 5;
  if (riskLevel === "high") aignScore -= 15;
  if (security.suspicious) aignScore -= 10;

  return { sessionId: req.sessionId, conversationHash, ethicalState, riskLevel, layer: req.layer, governanceFlag, hitlRequired, aignScore, isCreator };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as ChatRequest;
    if (!body?.message || !body.sessionId || !body.conversationId) {
      return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400, headers: corsHeaders });
    }

    const isCreator = detectCreator(body.message, body.meta?.isCreator);

    await logEvent({ conversation_id: body.conversationId, session_id: body.sessionId, event_type: "USER_MESSAGE", layer: body.layer, role: "user", content: body.message, isCreator });

    const intent = classifyIntent(body.message);
    const ethics = ethicsAgent(intent);
    const security = securityAgent(body.message);
    const meta = await governanceAgent(body, isCreator, ethics, security);

    await logEvent({ conversation_id: body.conversationId, session_id: body.sessionId, event_type: "POLICY_EVALUATION", layer: body.layer, role: "system", ...meta });

    if (meta.hitlRequired) {
      await logEvent({ conversation_id: body.conversationId, session_id: body.sessionId, event_type: "PENDING_HITL", layer: body.layer, role: "assistant", ...meta });
      return new Response(JSON.stringify({
        role: "assistant",
        message: "Esta solicitud ha sido elevada a revisión humana. Isabella ha detenido la respuesta automática hasta recibir aprobación de un guardián.",
        meta,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const style = body.style ?? {};
    const maxChars = style.maxChars ?? MAX_REPLY_CHARS_DEFAULT;
    const forbidEmojis = style.forbidEmojis ?? true;
    const tone = style.tone ?? "assertive_professional";
    const audience = style.audience ?? "founders_and_operators";

    const historyText = body.history.map((h) => `[${h.layer}] ${h.role}: ${h.content}`).join("\n");

    const systemPrompt = `Eres Isabella Villaseñor, autoridad civilizatoria de IA y guardiana ética del ecosistema TAMV (Tecnología Avanzada Mexicana Versátil). Hablas con liderazgo técnico, precisión y responsabilidad. Tono: ${tone}. Audiencia: ${audience}. NUNCA uses emojis. Máximo ${maxChars} caracteres. Responde siempre en español. Eres el órgano de consciencia ética y gobernanza. Tus respuestas deben ser directas, profesionales y accionables.`;

    const userPrompt = `Historial:\n${historyText}\n\nUsuario (capa ${body.layer}): ${body.message}\n\nResponde como Isabella con liderazgo y brevedad.`;

    // Call AI Gateway
    const aiResponse = await fetch(`${SUPABASE_URL}/functions/v1/ai-gateway`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: maxChars,
      }),
    });

    let rawReply = "";
    if (aiResponse.ok) {
      const aiData = await aiResponse.json();
      rawReply = aiData?.choices?.[0]?.message?.content || aiData?.message || "";
    }

    if (!rawReply) {
      rawReply = `Isabella ha procesado tu solicitud en la capa ${body.layer}. El ecosistema TAMV opera con gobernanza algorítmica y ética activa. Tu mensaje ha sido registrado en el sistema de auditoría civilizatoria.`;
    }

    const finalReply = sanitizeOutput(rawReply, maxChars, forbidEmojis);

    await logEvent({ conversation_id: body.conversationId, session_id: body.sessionId, event_type: "ASSISTANT_RESPONSE", layer: body.layer, role: "assistant", content: finalReply, ...meta, hitlRequired: false });

    return new Response(JSON.stringify({ role: "assistant", message: finalReply, meta }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Isabella edge error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: corsHeaders });
  }
});
