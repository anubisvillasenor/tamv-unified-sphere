import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

// ==============================
// TAMV – Tipos Civilizatorios
// ==============================

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

export interface IsabellaMessage {
  id: string;
  role: "user" | "assistant" | "human_guardian";
  content: string;
  meta: IsabellaMeta;
  created_at: string;
}

// ==============================
// Constantes de control
// ==============================

const MAX_REPLY_CHARS = 500;

const CREATOR_CODEWORDS = [
  "ANUBIS-V-PRIMUS",
  "TAMV-KERNEL-AUTHOR",
];

const ISABELLA_STYLE = {
  maxChars: MAX_REPLY_CHARS,
  forbidEmojis: true,
  tone: "assertive_professional",
  audience: "founders_and_operators",
};

// ==============================
// Utilidades
// ==============================

const createSessionId = () => crypto.randomUUID();

const isCreatorMessage = (text: string): boolean =>
  CREATOR_CODEWORDS.some((code) => text.includes(code));

const sanitizeAssistantMessage = (raw?: unknown): string => {
  if (typeof raw !== "string") {
    return "Transmisión recibida por Isabella.";
  }

  const noEmojis = raw.replace(
    /([\u231A-\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD-\u25FE\u2600-\u27BF\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDFFF])/g,
    ""
  );

  return noEmojis.slice(0, MAX_REPLY_CHARS).trim();
};

const defaultMeta = (sessionId: string): IsabellaMeta => ({
  sessionId,
  conversationHash: "genesis",
  ethicalState: "normal",
  riskLevel: "low",
  layer: "COGNITIVE",
  governanceFlag: "none",
  hitlRequired: false,
  aignScore: undefined,
  isCreator: false,
});

// ==============================
// Hook principal
// ==============================

export const useIsabella = () => {
  const { user } = useAuth();

  const initialSessionId = createSessionId();
  const sessionIdRef = useRef<string>(initialSessionId);

  const [messages, setMessages] = useState<IsabellaMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [meta, setMeta] = useState<IsabellaMeta>(() =>
    defaultMeta(initialSessionId)
  );

  // ==============================
  // Conversación
  // ==============================

  const startConversation = useCallback(async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("isabella_conversations")
        .insert({
          user_id: user.id,
          title: "Nueva conversación civilizatoria",
        })
        .select()
        .single();

      if (error) throw error;

      const newSessionId = createSessionId();
      sessionIdRef.current = newSessionId;

      setConversationId(data.id);
      setMessages([]);
      setMeta(defaultMeta(newSessionId));

      return data.id;
    } catch (error) {
      console.error("Error starting conversation:", error);
      return null;
    }
  }, [user]);

  // ==============================
  // Envío civilizatorio
  // ==============================

  const sendMessage = useCallback(
    async (content: string, layer: TamvLayer = "COGNITIVE") => {
      if (!user) return;

      const trimmed = content.trim();
      if (!trimmed) return;

      let currentConversationId = conversationId;
      if (!currentConversationId) {
        currentConversationId = await startConversation();
        if (!currentConversationId) return;
      }

      setLoading(true);

      const isCreator = isCreatorMessage(trimmed);
      const now = new Date().toISOString();

      const userMeta: IsabellaMeta = {
        ...meta,
        sessionId: sessionIdRef.current,
        layer,
        isCreator,
      };

      const userMessage: IsabellaMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
        meta: userMeta,
        created_at: now,
      };

      setMessages((prev) => [...prev, userMessage]);

      try {
        const history = [...messages, userMessage]
          .slice(-12)
          .map((m) => ({
            role: m.role,
            content: m.content,
            layer: m.meta.layer,
          }));

        const { data, error } = await supabase.functions.invoke("isabella-chat", {
          body: {
            message: trimmed,
            conversationId: currentConversationId,
            layer,
            sessionId: sessionIdRef.current,
            history,
            meta: { isCreator },
            style: ISABELLA_STYLE,
          },
        });

        if (error) throw error;

        const serverMeta: IsabellaMeta = {
          ...userMeta,
          ...(data?.meta ?? {}),
        };

        const assistantMessage: IsabellaMessage = {
          id: crypto.randomUUID(),
          role: (data?.role as IsabellaMessage["role"]) ?? "assistant",
          content: sanitizeAssistantMessage(data?.message),
          meta: serverMeta,
          created_at: new Date().toISOString(),
        };

        setMeta(serverMeta);
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error("Error sending message:", error);

        const infraFailMeta: IsabellaMeta = {
          ...meta,
          sessionId: sessionIdRef.current,
        };

        const errorMessage: IsabellaMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "La transmisión fue interrumpida por un fallo de infraestructura. Ninguna decisión civilizatoria ha sido tomada.",
          meta: infraFailMeta,
          created_at: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setLoading(false);
      }
    },
    [user, conversationId, meta, messages, startConversation]
  );

  // ==============================
  // Humano en loop (base)
  // ==============================

  const approveAsGuardian = useCallback(async (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? {
              ...m,
              role: "human_guardian",
              meta: {
                ...m.meta,
                hitlRequired: false,
                governanceFlag: "none",
              },
            }
          : m
      )
    );
  }, []);

  // ==============================
  // Limpieza
  // ==============================

  const clearConversation = useCallback(() => {
    const newSessionId = createSessionId();
    sessionIdRef.current = newSessionId;

    setMessages([]);
    setConversationId(null);
    setMeta(defaultMeta(newSessionId));
  }, []);

  return {
    messages,
    loading,
    meta,
    sendMessage,
    startConversation,
    approveAsGuardian,
    clearConversation,
    conversationId,
  };
};
