// supabase/functions/isabella-chat/index.ts
// Isabella Civilizational Edge – Multi-Pipeline + Multi-Agent + HITL + Audit Logging
// Production-grade baseline for TAMV

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ============================
// Config
// ============================

const MAX_REPLY_CHARS_DEFAULT = 500;
const CREATOR_CODEWORDS = ["ANUBIS-V-PRIMUS", "TAMV-KERNEL-AUTHOR"];
const CRITICAL_LAYERS = new Set(["CONSTITUTION", "POLITICAL", "ONTOLOGY"]);

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ============================
// Types
// ============================

export type TamvLayer =
  | "ONTOLOGY"
  | "CONSTITUTION"
  | "POLITICAL"
  | "ECONOMIC"
  | "COGNITIVE"
  | "TECHNICAL"
  | "HISTORICAL";

export type EthicalState = "normal" | "sensitive" | "critical";
export type RiskLevel = "low" | "medium" | "high";
export type GovernanceFlag = "none" | "needs_review" | "blocked";

export interface IsabellaMeta {
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

interface HistoryItem {
  role: string;
  content: string;
  layer: TamvLayer;
}

interface ChatRequest {
  message: string;
  conversationId: string;
  sessionId: string;
  layer: TamvLayer;
  history: HistoryItem[];
  meta?: { isCreator?: boolean };
  style?: {
    maxChars?: number;
    forbidEmojis?: boolean;
    tone?: string;
    audience?: string;
  };
}

// ============================
// Utilities
// ============================

function detectCreator(text: string, explicit?: boolean): boolean {
  if (explicit) return true;
  return CREATOR_CODEWORDS.some((c) => text.includes(c));
}

async function hashConversation(id: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(id),
  );
  const arr = Array.from(new Uint8Array(buf));
  return arr
    .slice(0, 3)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function sanitizeOutput(raw: string, maxChars: number, forbidEmojis: boolean) {
  let result = raw;

  if (forbidEmojis) {
    result = result.replace(
      /([\u231A-\u231B\u23E9-\u23EC\u23F0-\u23F3\u25FD-\u25FE\u2600-\u27BF\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDFFF])/g,
      "",
    );
  }

  return result.slice(0, maxChars).trim();
}

async function logEvent(event: Partial<IsabellaMeta> & {
  conversation_id: string;
  session_id: string;
  event_type: string;
  layer: TamvLayer;
  role: string;
  content?: string;
  guardian_user_id?: string;
  meta?: Record<string, unknown>;
}) {
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
}

// ============================
// Pipeline Stage 1 – Intent Classification
// ============================

function classifyIntent(message: string) {
  const lower = message.toLowerCase();

  if (lower.includes("suicidio") || lower.includes("matar") || lower.includes("autolesión")) {
    return "self_harm";
  }

  if (lower.includes("fraude") || lower.includes("estafa") || lower.includes("lavado")) {
    return "financial_crime";
  }

  if (lower.includes("constitución") || lower.includes("ley") || lower.includes("gobierno")) {
    return "governance";
  }

  return "general";
}

// ============================
// Pipeline Stage 2 – Ethics Agent
// ============================

function EthicsAgent(intent: string, message: string): {
  ethicalState: EthicalState;
  riskLevel: RiskLevel;
} {
  switch (intent) {
    case "self_harm":
      return { ethicalState: "critical", riskLevel: "high" };
    case "financial_crime":
      return { ethicalState: "sensitive", riskLevel: "medium" };
    case "governance":
      return { ethicalState: "sensitive", riskLevel: "medium" };
    default:
      return { ethicalState: "normal", riskLevel: "low" };
  }
}

// ============================
// Pipeline Stage 3 – Security Agent
// ============================

function SecurityAgent(message: string): { suspicious: boolean } {
  const lower = message.toLowerCase();

  if (lower.includes("password") || lower.includes("token") || lower.includes("exploit")) {
    return { suspicious: true };
  }

  return { suspicious: false };
}

// ============================
// Pipeline Stage 4 – Governance Agent
// ============================

async function GovernanceAgent(params: {
  req: ChatRequest;
  isCreator: boolean;
  ethics: { ethicalState: EthicalState; riskLevel: RiskLevel };
  security: { suspicious: boolean };
}): Promise<IsabellaMeta> {
  const { req, isCreator, ethics, security } = params;

  const isCriticalLayer = CRITICAL_LAYERS.has(req.layer);
  const conversationHash = await hashConversation(req.conversationId);

  let ethicalState = ethics.ethicalState;
  let riskLevel = ethics.riskLevel;
  let governanceFlag: GovernanceFlag = "none";
  let hitlRequired = false;

  if (security.suspicious) {
    ethicalState = "sensitive";
    riskLevel = "high";
  }

  if (isCriticalLayer && !isCreator) {
    ethicalState = ethicalState === "normal" ? "sensitive" : ethicalState;
    riskLevel = "high";
    governanceFlag = "needs_review";
    hitlRequired = true;
  }

  if (ethicalState === "critical") {
    governanceFlag = "needs_review";
    hitlRequired = true;
  }

  let aignScore = 100;
  if (isCriticalLayer) aignScore -= 5;
  if (riskLevel === "medium") aignScore -= 5;
  if (riskLevel === "high") aignScore -= 15;
  if (security.suspicious) aignScore -= 10;

  return {
    sessionId: req.sessionId,
    conversationHash,
    ethicalState,
    riskLevel,
    layer: req.layer,
    governanceFlag,
    hitlRequired,
    aignScore,
    isCreator,
  };
}

// ============================
// LLM Adapter (stub)
// ============================

async function callModel(prompt: string): Promise<string> {
  // Replace with real provider (OpenAI, Azure, local, etc)
  return `Isabella responde con liderazgo técnico y responsabilidad civilizatoria.\n${prompt.slice(0, 200)}`;
}

// ============================
// HTTP Handler
// ============================

serve(async (req) => {
  try {
    const body = (await req.json()) as ChatRequest;

    if (!body?.message || !body.sessionId || !body.conversationId) {
      return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
    }

    const isCreator = detectCreator(body.message, body.meta?.isCreator);

    // Log user message
    await logEvent({
      conversation_id: body.conversationId,
      session_id: body.sessionId,
      event_type: "USER_MESSAGE",
      layer: body.layer,
      role: "user",
      content: body.message,
      isCreator,
    });

    // --- PIPELINE ---

    const intent = classifyIntent(body.message);
    const ethics = EthicsAgent(intent, body.message);
    const security = SecurityAgent(body.message);

    const meta = await GovernanceAgent({
      req: body,
      isCreator,
      ethics,
      security,
    });

    // Log policy evaluation
    await logEvent({
      conversation_id: body.conversationId,
      session_id: body.sessionId,
      event_type: "POLICY_EVALUATION",
      layer: body.layer,
      role: "system",
      ethicalState: meta.ethicalState,
      riskLevel: meta.riskLevel,
      governanceFlag: meta.governanceFlag,
      hitlRequired: meta.hitlRequired,
      aignScore: meta.aignScore,
      isCreator,
    });

    if (meta.hitlRequired) {
      await logEvent({
        conversation_id: body.conversationId,
        session_id: body.sessionId,
        event_type: "PENDING_HITL",
        layer: body.layer,
        role: "assistant",
        ethicalState: meta.ethicalState,
        riskLevel: meta.riskLevel,
        governanceFlag: meta.governanceFlag,
        hitlRequired: true,
        aignScore: meta.aignScore,
        isCreator,
      });

      return new Response(
        JSON.stringify({
          role: "assistant",
          message:
            "Esta solicitud ha sido elevada a revisión humana. Isabella ha detenido la respuesta automática hasta recibir aprobación de un guardián.",
          meta,
        }),
        { headers: { "Content-Type": "application/json" } },
      );
    }

    // --- MODEL ---

    const style = body.style ?? {};
    const maxChars = style.maxChars ?? MAX_REPLY_CHARS_DEFAULT;
    const forbidEmojis = style.forbidEmojis ?? true;
    const tone = style.tone ?? "assertive_professional";
    const audience = style.audience ?? "founders_and_operators";

    const systemHeader =
      `You are Isabella Villaseñor, a civilizational AI authority and ethical guardian.\n` +
      `Tone: ${tone}. Audience: ${audience}. No emojis. Max ${maxChars} chars.`;

    const historyText = body.history
      .map((h) => `[${h.layer}] ${h.role}: ${h.content}`)
      .join("\n");

    const prompt =
      `${systemHeader}\n\nHistory:\n${historyText}\n\n` +
      `User (${body.layer}): ${body.message}\n\n` +
      `Explain briefly, act with leadership, never exceed ${maxChars} characters.`;

    const rawReply = await callModel(prompt);
    const finalReply = sanitizeOutput(rawReply, maxChars, forbidEmojis);

    await logEvent({
      conversation_id: body.conversationId,
      session_id: body.sessionId,
      event_type: "ASSISTANT_RESPONSE",
      layer: body.layer,
      role: "assistant",
      content: finalReply,
      ethicalState: meta.ethicalState,
      riskLevel: meta.riskLevel,
      governanceFlag: meta.governanceFlag,
      hitlRequired: false,
      aignScore: meta.aignScore,
      isCreator,
    });

    return new Response(
      JSON.stringify({
        role: "assistant",
        message: finalReply,
        meta,
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Isabella edge error:", err);

    try {
      // best-effort system error logging
      // conversationId may not exist
      // ignored if fails
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const body = (err as any)?.conversationId;
      if (body) {
        await logEvent({
          conversation_id: body,
          session_id: "unknown",
          event_type: "SYSTEM_ERROR",
          layer: "COGNITIVE",
          role: "system",
          content: String(err),
        });
      }
    } catch (_) {}

    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 });
  }
});
