import { motion } from 'framer-motion';
import { TrendingUp, Hash, Users, Flame } from 'lucide-react';

const trendingTopics = [
  { tag: 'TAMVOnline', posts: '12.5K', category: 'Tecnología' },
  { tag: 'IsabellaAI', posts: '8.3K', category: 'Inteligencia Artificial' },
  { tag: 'MSRToken', posts: '6.7K', category: 'Economía Digital' },
  { tag: 'MetaversoMX', posts: '5.2K', category: 'Metaverso' },
  { tag: 'CivilizacionDigital', posts: '4.1K', category: 'Cultura' },
  { tag: 'BookPI', posts: '3.8K', category: 'Blockchain' },
];

const suggestedUsers = [
  { name: 'Isabella Villaseñor', username: 'isabella_ai', avatar: null, verified: true },
  { name: 'TAMV DevHub', username: 'tamv_dev', avatar: null, verified: true },
  { name: 'Universidad TAMV', username: 'utamv', avatar: null, verified: true },
];

export const TrendingSidebar = () => {
  return (
    <div className="space-y-4">
      {/* Trending Topics */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-card rounded-xl border border-border overflow-hidden"
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Tendencias</h3>
          </div>
        </div>
        <div className="divide-y divide-border">
          {trendingTopics.map((topic, i) => (
            <motion.div
              key={topic.tag}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="p-3 hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{topic.category}</p>
                  <p className="font-medium text-foreground flex items-center gap-1">
                    <Hash className="h-3 w-3 text-primary" />
                    {topic.tag}
                  </p>
                  <p className="text-xs text-muted-foreground">{topic.posts} publicaciones</p>
                </div>
                {i < 3 && <Flame className="h-4 w-4 text-orange-500" />}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="p-3 border-t border-border">
          <button className="text-primary text-sm hover:underline">
            Ver más tendencias
          </button>
        </div>
      </motion.div>

      {/* Suggested Users */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl border border-border overflow-hidden"
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Sugeridos</h3>
          </div>
        </div>
        <div className="divide-y divide-border">
          {suggestedUsers.map((user, i) => (
            <motion.div
              key={user.username}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 + 0.2 }}
              className="p-3 flex items-center justify-between hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-medium">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">@{user.username}</p>
                </div>
              </div>
              <button className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full hover:bg-primary/90 transition-colors">
                Seguir
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer Links */}
      <div className="text-xs text-muted-foreground space-y-2 px-2">
        <p className="flex flex-wrap gap-x-2 gap-y-1">
          <a href="#" className="hover:underline">Términos</a>
          <a href="#" className="hover:underline">Privacidad</a>
          <a href="#" className="hover:underline">BookPI</a>
          <a href="#" className="hover:underline">DevHub</a>
        </p>
        <p>© 2026 TAMV Online - Tecnología Avanzada Mexicana Versátil</p>
      </div>
    </div>
  );
};
