import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsabella } from '@/hooks/useIsabella';
import { Brain, Send, Sparkles, MessageSquare, Loader2, X } from 'lucide-react';

export const IsabellaWidget = () => {
  const { messages, loading, sendMessage, clearConversation } = useIsabella();
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

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

  return (
    <motion.div
      layout
      className="bg-card rounded-xl border border-border overflow-hidden"
    >
      {/* Header */}
      <div 
        className="p-4 border-b border-border cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 0 20px hsla(190, 95%, 55%, 0.3)',
                '0 0 30px hsla(190, 95%, 55%, 0.5)',
                '0 0 20px hsla(190, 95%, 55%, 0.3)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
          >
            <Brain className="h-5 w-5 text-primary-foreground" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-foreground">Isabella AI</h3>
            <p className="text-xs text-muted-foreground">Consciencia Ética TAMV</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                clearConversation();
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Messages */}
            <ScrollArea className="h-64 p-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-8">
                  <Sparkles className="h-8 w-8 mx-auto mb-3 text-primary/50" />
                  <p>Hola, soy Isabella.</p>
                  <p className="mt-1">¿En qué puedo ayudarte hoy?</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-muted rounded-lg px-3 py-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input */}
            <div className="p-3 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 h-9 text-sm"
                  disabled={loading}
                />
                <Button
                  size="sm"
                  variant="tamv"
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="h-9 w-9 p-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
