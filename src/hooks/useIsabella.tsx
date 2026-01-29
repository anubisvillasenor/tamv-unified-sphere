import { useState, useCallback } from "react";
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
}

export interface IsabellaMessage {
  id: string;
  role: "user" | "assistant" | "human_guardian";
  content: string;
  meta: IsabellaMeta;
  created_at: string;
}

const defaultMeta = (): IsabellaMeta => ({
  sessionId: crypto.randomUUID(),
  conversationHash: "genesis",
  ethicalState: "normal",
  riskLevel: "low",
  layer: "COGNITIVE",
  governanceFlag: "none",
  hitlRequired: false,
});

// ==============================
// Hook civilizatorio principal
// ==============================

export const useIsabella = () => {
  const { user } = useAuth();

  const [messages, setMessages] = useState<IsabellaMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [meta, setMeta] = useState<IsabellaMeta>(defaultMeta());

  // ==============================
  // Conversación
  // ==============================

  const startConversation = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("isabella_conversations")
        .insert({ user_id: user.id, title: "Nueva conversación civilizatoria" })
        .select()
        .single();

      if (error) throw error;

      setConversationId(data.id);
      setMessages([]);
      setMeta(defaultMeta());

      return data.id;
    } catch (error) {
      console.error("Error starting conversation:", error);
      return null;
    }
  };

  // ==============================
  // Envío civilizatorio
  // ==============================

  const sendMessage = useCallback(
    async (content: string, layer: TamvLayer = "COGNITIVE") => {
      if (!user) return;

      setLoading(true);

      const userMeta: IsabellaMeta = {
        ...meta,
        layer,
      };

      const userMessage: IsabellaMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        meta: userMeta,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);

      try {
        const response = await supabase.functions.invoke("isabella-chat", {
          body: {
            message: content,
            conversationId,
            layer,
            sessionId: meta.sessionId,
            history: messages.slice(-12).map((m) => ({
              role: m.role,
              content: m.content,
              layer: m.meta.layer,
            })),
          },
        });

        if (response.error) throw response.error;

        const serverMeta: IsabellaMeta = response.data.meta ?? {
          ...meta,
          layer,
        };

        const assistantMessage: IsabellaMessage = {
          id: crypto.randomUUID(),
          role: response.data.role ?? "assistant",
          content: response.data.message,
          meta: serverMeta,
          created_at: new Date().toISOString(),
        };

        setMeta(serverMeta);
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error("Error sending message:", error);

        const failMeta: IsabellaMeta = {
          ...meta,
          ethicalState: "critical",
          riskLevel: "high",
        };

        const errorMessage: IsabellaMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "La transmisión fue interrumpida por el subsistema de seguridad civilizatoria. Intenta nuevamente.",
          meta: failMeta,
          created_at: new Date().toISOString(),
        };

        setMeta(failMeta);
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setLoading(false);
      }
    },
    [user, conversationId, messages, meta]
  );

  const approveAsGuardian = async (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? {
              ...m,
              role: "human_guardian",
              meta: { ...m.meta, hitlRequired: false, governanceFlag: "none" },
            }
          : m
      )
    );
  };

  const clearConversation = () => {
    setMessages([]);
    setConversationId(null);
    setMeta(defaultMeta());
  };

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
