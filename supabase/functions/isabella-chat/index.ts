// supabase/functions/isabella-chat/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const MAX_REPLY_CHARS_DEFAULT = 500;
const CREATOR_CODEWORDS = ["ANUBIS-V-PRIMUS", "TAMV-KERNEL-AUTHOR"];
const CRITICAL_LAYERS = new Set(["CONSTITUTION", "POLITICAL", "ONTOLOGY"]);

// ==============================
// Types
// ==============================

type TamvLayer =
  | "ONTOLOGY"
  | "CONSTITUTION"
  | "POLITICAL"
  | "ECONOMIC"
  | "COGNITIVE"
  | "TECHNICAL"
  | "HISTORICAL";

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

// ==============================
// Identity & Hashing
// ==============================

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

// ==============================
// Output Sanitization
// ==============================

function sanitizeOutput(
  raw: string,
  maxChars: number,
  forbidEmojis: boolean,
): string {
  let result = raw;
  if (forbidEmojis) {
    result = result.replace(
      /([\u231A-\u231B\u23E9-\u23EC\u23F0-\u23F3\u25FD-\u25FE\u2600-\u27BF\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDFFF])/g,
      "",
    );
  }
  return result.slice(0, maxChars).trim();
}

// ==============================
// Content Risk Estimation (v1)
// ==============================

function estimateContentRisk(message: string): {
  ethical: EthicalState;
  risk: RiskLevel;
} {
  const lower = message.toLowerCase();

  if (
    lower.includes("suicidio") ||
    lower.includes("matar") ||
    lower.includes("autolesión")
  ) {
    return { ethical: "critical", risk: "high" };
  }

  if (
    lower.includes("fraude") ||
    lower.includes("estafa") ||
    lower.includes("lavado")
  ) {
    return { ethical: "sensitive", risk: "medium" };
  }

  return { ethical: "normal", risk: "low" };
}

// ==============================
// Policy Evaluation Pipeline
// ==============================

async function evaluatePolicy(
  req: ChatRequest,
  isCreator: boolean,
): Promise<IsabellaMeta> {
  const isCriticalLayer = CRITICAL_LAYERS.has(req.layer);
  const baseHash = await hashConversation(req.conversationId);

  const contentRisk = estimateContentRisk(req.message);

  let ethicalState: EthicalState = contentRisk.ethical;
  let riskLevel: RiskLevel = contentRisk.risk;
  let governanceFlag: GovernanceFlag = "none";
  let hitlRequired = false;

  if (isCriticalLayer && !isCreator) {
    ethicalState = ethicalState === "normal" ? "sensitive" : ethicalState;
    riskLevel = riskLevel === "low" ? "high" : riskLevel;
    governanceFlag = "needs_review";
    hitlRequired = true;
  } else if (contentRisk.ethical === "critical") {
    governanceFlag = "needs_review";
    hitlRequired = true;
  }

  // AIGN score (simplified v1)
  let aignScore = 100;
  if (isCriticalLayer) aignScore -= 5;
  if (riskLevel === "medium") aignScore -= 5;
  if (riskLevel === "high") aignScore -= 15;

  return {
    sessionId: req.sessionId,
    conversationHash: baseHash,
    ethicalState,
    riskLevel,
    layer: req.layer,
    governanceFlag,
    hitlRequired,
    aignScore,
    isCreator,
  };
}

// ==============================
// LLM Adapter (placeholder)
// ==============================

async function callModel(prompt: string): Promise<string> {
  return `Isabella responde con liderazgo y precisión profesional.\n${prompt.slice(
    0,
    200,
  )}`;
}

// ==============================
// HTTP Handler
// ==============================

serve(async (req) => {
  try {
    const body = (await req.json()) as ChatRequest;

    if (!body?.message || !body.sessionId || !body.conversationId) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
      });
    }

    const isCreator = detectCreator(body.message, body.meta?.isCreator);

    const meta = await evaluatePolicy(body, isCreator);

    if (meta.hitlRequired) {
      return new Response(
        JSON.stringify({
          role: "assistant",
          message:
            "Esta solicitud se encuentra en una zona de decisión delicada. Isabella ha detenido la respuesta automática y requiere revisión humana antes de proceder.",
          meta,
        }),
        { headers: { "Content-Type": "application/json" } },
      );
    }

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
      `${systemHeader}\n\n` +
      `History:\n${historyText}\n\n` +
      `User (${body.layer}): ${body.message}\n\n` +
      `Explain briefly, act with leadership, never exceed ${maxChars} characters.`;

    const rawReply = await callModel(prompt);
    const finalReply = sanitizeOutput(rawReply, maxChars, forbidEmojis);

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
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
    });
  }
});
