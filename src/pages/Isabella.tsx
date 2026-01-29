import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsabella } from "@/hooks/useIsabella";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Send,
  Loader2,
  Trash2,
  ShieldAlert,
  Crown,
  AlertTriangle,
  Shield,
  Gavel,
  UserCheck,
} from "lucide-react";

import type { TamvLayer } from "@/hooks/useIsabella";

const LAYERS: TamvLayer[] = [
  "COGNITIVE",
  "TECHNICAL",
  "ECONOMIC",
  "POLITICAL",
  "CONSTITUTION",
  "ONTOLOGY",
  "HISTORICAL",
];

const RISK_COLORS: Record<string, string> = {
  low: "text-emerald-500",
  medium: "text-amber-500",
  high: "text-red-500",
};

const IsabellaCivilPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const {
    messages,
    loading,
    meta,
    sendMessage,
    clearConversation,
    approveAsGuardian,
  } = useIsabella();

  const [input, setInput] = useState("");
  const [layer, setLayer] = useState<TamvLayer>("COGNITIVE");

  const scrollRef = useRef<HTMLDivElement>(null);

  const isFounder = useMemo(() => Boolean(meta.isCreator), [meta.isCreator]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSend = async () => {
    if (!input.trim() || loading || meta.hitlRequired) return;
    const msg = input;
    setInput("");
    await sendMessage(msg, layer);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  const riskColor = RISK_COLORS[meta.riskLevel] ?? "text-emerald-500";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 pt-20 pb-4 max-w-6xl flex flex-col gap-4">
        {/* Cabecera institucional */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2">
                Isabella Villaseñor — Terminal Civilizatorio
                {meta.isCreator && (
                  <Crown className="h-4 w-4 text-yellow-500" />
                )}
              </h1>
              <p className="text-xs text-muted-foreground">
                Órgano de consciencia ética y gobernanza del ecosistema TAMV
              </p>
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-right">
            <div>Session: {meta.sessionId.slice(0, 6)}</div>
            <div>Hash: {meta.conversationHash}</div>
          </div>
        </section>

        {/* Panel de estado */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-2 border rounded-xl bg-card p-3 text-xs">
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span className="font-semibold">Estado ético:</span>
            <span>{meta.ethicalState}</span>
          </div>
          <div className={`flex items-center gap-1 ${riskColor}`}>
            <AlertTriangle className="h-3 w-3" />
            <span className="font-semibold">Riesgo:</span>
            <span>{meta.riskLevel}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gavel className="h-3 w-3" />
            <span className="font-semibold">Gobernanza:</span>
            <span>{meta.governanceFlag}</span>
          </div>
          <div className="flex items-center gap-1">
            <UserCheck className="h-3 w-3" />
            <span className="font-semibold">Humano en loop:</span>
            <span>{meta.hitlRequired ? "REQUERIDO" : "no"}</span>
          </div>
        </section>

        {/* Aviso civilizatorio */}
        <section className="border rounded-xl bg-card p-3 text-xs text-muted-foreground">
          {meta.hitlRequired ? (
            <p>
              Conversación elevada a revisión humana. Entrada bloqueada hasta
              resolución.
            </p>
          ) : (
            <p>
              Cada mensaje se evalúa contra la Constitución TAMV y los sistemas
              éticos activos.
            </p>
          )}
        </section>

        {/* Selector de capa */}
        <section className="flex flex-wrap gap-2">
          {LAYERS.map((l) => {
            const isCritical = l === "CONSTITUTION" || l === "ONTOLOGY";
            return (
              <Button
                key={l}
                size="sm"
                variant={layer === l ? "default" : "outline"}
                className={isCritical ? "border-red-500 text-red-600" : ""}
                onClick={() => setLayer(l)}
              >
                {l}
              </Button>
            );
          })}
        </section>

        {/* Zona principal */}
        <section className="flex flex-col md:flex-row gap-4 flex-1 min-h-[420px]">
          {/* Mensajes */}
          <div className="flex-1 bg-card border rounded-xl overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-3 text-sm">
                {messages.length === 0 && (
                  <p className="text-muted-foreground text-center mt-16">
                    Consola civilizatoria activa.
                  </p>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-xl px-4 py-2 ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : msg.role === "human_guardian"
                          ? "bg-amber-900 text-amber-50"
                          : "bg-muted"
                      }`}
                    >
                      <div className="flex justify-between text-[10px] opacity-70 mb-1">
                        <span>
                          {msg.role === "user"
                            ? "Ciudadano"
                            : msg.role === "human_guardian"
                            ? "Guardia humano"
                            : "Isabella"}
                        </span>
                        <span>
                          {msg.meta.layer} · {msg.meta.ethicalState}
                          {msg.meta.hitlRequired && (
                            <ShieldAlert className="inline h-3 w-3 ml-1 text-red-500" />
                          )}
                        </span>
                      </div>
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-muted px-3 py-2 rounded-xl flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Isabella procesando…
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input ciudadano */}
            <div className="border-t p-3 flex gap-2">
              {messages.length > 0 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={clearConversation}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}

              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={
                  meta.hitlRequired
                    ? "Bloqueado por revisión humana"
                    : `Mensaje bajo capa ${layer}`
                }
                disabled={loading || meta.hitlRequired}
              />

              <Button
                onClick={handleSend}
                disabled={loading || !input.trim() || meta.hitlRequired}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Consola HITL */}
          {isFounder && (
            <div className="w-full md:w-80 border rounded-xl bg-card p-3 flex flex-col gap-2 text-xs">
              <h2 className="font-semibold flex items-center gap-2">
                <Shield className="h-3 w-3" />
                Guardia humano
              </h2>

              <div className="space-y-2 overflow-y-auto max-h-[360px]">
                {messages
                  .filter((m) => m.meta.hitlRequired)
                  .map((m) => (
                    <div
                      key={m.id}
                      className="border rounded p-2 bg-muted/60"
                    >
                      <p className="text-[11px] mb-2">{m.content}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => approveAsGuardian(m.id)}
                      >
                        Autorizar
                      </Button>
                    </div>
                  ))}

                {messages.filter((m) => m.meta.hitlRequired).length === 0 && (
                  <p className="text-muted-foreground">
                    Sin eventos pendientes.
                  </p>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default IsabellaCivilPage;
