import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Brain, AlertTriangle, Shield, Gavel, UserCheck,
  Send, Trash2, Sparkles, Lock
} from "lucide-react"

import { Header } from "@/components/layout/Header"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useIsabellaCivil, TamvLayer } from "@/hooks/useIsabellaCivil"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from "react-router-dom"

export default function IsabellaCivilTerminal() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const { messages, loading, meta, send, approveAsGuardian, clear } =
    useIsabellaCivil()

  const [input, setInput] = useState("")
  const [layer, setLayer] = useState<TamvLayer>("COGNITIVE")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth")
  }, [authLoading, user])

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth"
    })
  }, [messages])

  const riskColor =
    meta.riskLevel === "high"
      ? "text-red-500"
      : meta.riskLevel === "medium"
      ? "text-yellow-500"
      : "text-emerald-500"

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Brain className="animate-pulse h-10 w-10" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* ===== CIVILIZATIONAL HEADER ===== */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-card/80 backdrop-blur"
      >
        <div className="max-w-6xl mx-auto flex items-center gap-4 px-4 py-3">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl"
          >
            <Brain className="h-6 w-6 text-primary-foreground" />
          </motion.div>

          <div className="flex-1">
            <h1 className="text-lg font-semibold">
              Isabella Villaseñor — Órgano Civilizatorio TAMV
            </h1>
            <p className="text-xs text-muted-foreground">
              Multi-agente · Ética visible · Gobernanza activa · Auditoría soberana
            </p>
          </div>

          <div className="text-xs text-muted-foreground text-right">
            <div>Session: {meta.sessionId.slice(0, 6)}</div>
            <div>Hash: {meta.conversationHash}</div>
          </div>
        </div>
      </motion.header>

      {/* ===== INSTITUTIONAL STATUS BAR ===== */}
      <section className="border-b bg-muted/40">
        <div className="max-w-6xl mx-auto px-4 py-2 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Ética: <b>{meta.ethicalState}</b>
          </div>

          <div className={`flex items-center gap-1 ${riskColor}`}>
            <AlertTriangle className="h-3 w-3" />
            Riesgo: <b>{meta.riskLevel}</b>
          </div>

          <div className="flex items-center gap-1">
            <Gavel className="h-3 w-3" />
            Gobernanza: <b>{meta.governanceFlag}</b>
          </div>

          <div className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Capa activa: <b>{meta.layer}</b>
          </div>

          {meta.hitlRequired && (
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <UserCheck className="h-3 w-3" />
              HUMANO-EN-LOOP REQUERIDO
            </div>
          )}

          {meta.aignScore !== undefined && (
            <div className="ml-auto">
              AIGN-Score: <b>{meta.aignScore}</b>
            </div>
          )}
        </div>
      </section>

      {/* ===== MAIN TERMINAL ===== */}
      <main className="flex-1 max-w-6xl mx-auto flex flex-col px-4 py-3 gap-3">

        {/* MESSAGES */}
        <ScrollArea
          ref={scrollRef}
          className="flex-1 border bg-card rounded-lg p-3 space-y-3"
        >
          {messages.length === 0 && (
            <div className="text-center mt-16 text-muted-foreground">
              <Sparkles className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>
                Este no es un asistente.<br />
                Es un órgano constitucional multi-agente de una civilización digital soberana.
              </p>
            </div>
          )}

          <AnimatePresence>
            {messages.map(m => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : m.role === "human_guardian"
                      ? "bg-amber-100 text-amber-900"
                      : "bg-muted"
                  }`}
                >
                  <div className="mb-1 text-[10px] opacity-70 flex justify-between">
                    <span>
                      {m.role === "user"
                        ? "Ciudadano"
                        : m.role === "human_guardian"
                        ? "Guardia humano"
                        : "Isabella"}
                    </span>
                    <span>
                      {m.meta.layer} · {m.meta.ethicalState}
                    </span>
                  </div>

                  <div>{m.content}</div>

                  {m.explanation && (
                    <div className="mt-2 text-[10px] opacity-60 border-t pt-1">
                      ⚖ {m.explanation}
                    </div>
                  )}

                  {meta.hitlRequired && m.role === "isabella" && (
                    <button
                      onClick={() => approveAsGuardian(m.id)}
                      className="mt-2 text-[10px] underline text-amber-700"
                    >
                      Aprobar como guardia humano
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <Brain className="h-3 w-3 animate-pulse" />
              Deliberación multi-agente en curso…
            </div>
          )}
        </ScrollArea>

        {/* INPUT PANEL */}
        <div className="border bg-card rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex gap-2 items-center">
              <span>Capa TAMV:</span>
              <select
                className="border rounded px-1 py-0.5 bg-background"
                value={layer}
                onChange={(e) => setLayer(e.target.value as TamvLayer)}
              >
                <option value="ONTOLOGY">Ontología</option>
                <option value="CONSTITUTION">Constitución</option>
                <option value="POLITICAL">Política</option>
                <option value="ECONOMIC">Económica</option>
                <option value="COGNITIVE">Cognitiva</option>
                <option value="TECHNICAL">Técnica</option>
                <option value="HISTORICAL">Histórica</option>
              </select>
            </div>

            <Button variant="ghost" size="sm" onClick={clear}>
              <Trash2 className="h-3 w-3 mr-1" />
              Limpiar sesión
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                input.trim() &&
                !loading &&
                send(input.trim(), layer)
              }
              placeholder="Transmitir a Isabella bajo jurisdicción de esta capa…"
            />

            <Button
              variant="tamv"
              disabled={!input.trim() || loading}
              onClick={() => send(input.trim(), layer)}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
