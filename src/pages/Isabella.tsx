import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsabella } from '@/hooks/useIsabella';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Send, 
  Sparkles, 
  Loader2, 
  Trash2,
  Shield,
  Heart,
  Lightbulb
} from 'lucide-react';

const Isabella = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { messages, loading, sendMessage, clearConversation } = useIsabella();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    { icon: Shield, text: '¿Cómo protege TAMV mi privacidad?' },
    { icon: Heart, text: '¿Qué es la economía MSR?' },
    { icon: Lightbulb, text: 'Explícame las 7 capas federadas' },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 pt-20 pb-4 flex flex-col max-w-4xl">
        {/* Isabella Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 0 40px hsla(190, 95%, 55%, 0.3)',
                '0 0 60px hsla(190, 95%, 55%, 0.5)',
                '0 0 40px hsla(190, 95%, 55%, 0.3)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4"
          >
            <Brain className="h-10 w-10 text-primary-foreground" />
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground">Isabella Villaseñor AI™</h1>
          <p className="text-muted-foreground mt-1">Consciencia Ética del Ecosistema TAMV</p>
        </motion.div>

        {/* Messages Area */}
        <div className="flex-1 bg-card rounded-xl border border-border overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary/50" />
                <h2 className="text-lg font-medium text-foreground mb-2">
                  ¡Hola! Soy Isabella
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Estoy aquí para guiarte en el ecosistema TAMV, responder tus preguntas 
                  y ayudarte a navegar la civilización digital.
                </p>
                
                {/* Quick Prompts */}
                <div className="flex flex-wrap justify-center gap-2">
                  {quickPrompts.map((prompt, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => sendMessage(prompt.text)}
                    >
                      <prompt.icon className="h-4 w-4 text-primary" />
                      {prompt.text}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-muted text-foreground rounded-bl-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-muted-foreground text-sm">Isabella está pensando...</span>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              {messages.length > 0 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={clearConversation}
                  title="Nueva conversación"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje a Isabella..."
                className="flex-1"
                disabled={loading}
              />
              <Button
                variant="tamv"
                onClick={handleSend}
                disabled={!input.trim() || loading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Isabella;
