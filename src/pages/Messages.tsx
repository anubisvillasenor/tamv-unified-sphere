import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Users,
  Radio,
  Search,
  Plus,
  Send,
  Loader2,
  Hash
} from 'lucide-react';

const Messages = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Demo channels
  const channels = [
    { id: '1', name: 'General TAMV', type: 'group', unread: 5, lastMessage: '¡Bienvenidos al ecosistema!' },
    { id: '2', name: 'DevHub Developers', type: 'group', unread: 12, lastMessage: 'Nueva API disponible...' },
    { id: '3', name: 'Arte Digital', type: 'group', unread: 0, lastMessage: 'Subasta terminada' },
    { id: '4', name: 'Universidad TAMV', type: 'broadcast', unread: 2, lastMessage: 'Nuevo curso disponible' },
    { id: '5', name: 'Isabella Villaseñor', type: 'private', unread: 1, lastMessage: 'Gracias por tu pregunta...' },
  ];

  const demoMessages = [
    { id: '1', sender: 'Sistema TAMV', content: '¡Bienvenido al canal! Recuerda seguir las normas de la comunidad.', time: '10:00', isSystem: true },
    { id: '2', sender: 'Carlos Dev', content: '¿Alguien ha probado la nueva API de BookPI?', time: '10:15', isSystem: false },
    { id: '3', sender: 'María García', content: 'Sí, funciona perfectamente. El registro de auditoría es muy completo.', time: '10:18', isSystem: false },
    { id: '4', sender: 'Edwin Castillo', content: 'Excelente feedback. Estamos trabajando en mejoras para la v2.', time: '10:25', isSystem: false },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 h-screen flex">
        {/* Sidebar - Channels */}
        <aside className="w-80 border-r border-border flex flex-col bg-card">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Mensajes</h2>
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar conversaciones..." className="pl-9" />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="divide-y divide-border">
              {channels.map((channel) => (
                <motion.div
                  key={channel.id}
                  whileHover={{ backgroundColor: 'hsla(var(--muted) / 0.5)' }}
                  className={`p-3 cursor-pointer ${selectedChannel === channel.id ? 'bg-muted' : ''}`}
                  onClick={() => setSelectedChannel(channel.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {channel.type === 'group' ? <Users className="h-4 w-4" /> 
                          : channel.type === 'broadcast' ? <Radio className="h-4 w-4" />
                          : <MessageSquare className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground text-sm truncate">
                          {channel.name}
                        </span>
                        {channel.unread > 0 && (
                          <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                            {channel.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {channel.lastMessage}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChannel ? (
            <>
              {/* Chat Header */}
              <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-card">
                <div className="flex items-center gap-3">
                  <Hash className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium text-foreground">
                    {channels.find(c => c.id === selectedChannel)?.name}
                  </span>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {demoMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={msg.isSystem ? 'text-center' : ''}
                    >
                      {msg.isSystem ? (
                        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                          {msg.content}
                        </span>
                      ) : (
                        <div className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/20 text-primary text-xs">
                              {msg.sender.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground text-sm">{msg.sender}</span>
                              <span className="text-xs text-muted-foreground">{msg.time}</span>
                            </div>
                            <p className="text-foreground text-sm">{msg.content}</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-border bg-card">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1"
                  />
                  <Button variant="tamv">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Selecciona una conversación</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Messages;
