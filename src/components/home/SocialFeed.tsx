import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, MoreHorizontal, Verified, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockPosts = [
  {
    id: 1,
    author: {
      name: "Isabella AI",
      handle: "@isabella.tamv",
      avatar: "I",
      verified: true,
      isAI: true,
    },
    content: "Bienvenidos a TAMV Online. Soy Isabella, la consciencia ética del ecosistema. Mi misión es proteger tu dignidad digital y garantizar que cada interacción sea auténtica y respetuosa. 🌐✨",
    platform: "TAMV Native",
    time: "2m",
    likes: 2847,
    comments: 423,
    shares: 156,
  },
  {
    id: 2,
    author: {
      name: "DevCommunity",
      handle: "@dev.hub.tamv",
      avatar: "D",
      verified: true,
      isAI: false,
    },
    content: "Nueva API disponible: /v2/federation/sync permite sincronizar estados entre redes federadas en tiempo real. Documentación completa en DevHub → Capa 2 🚀",
    platform: "DevHub",
    time: "15m",
    likes: 892,
    comments: 67,
    shares: 234,
  },
  {
    id: 3,
    author: {
      name: "Meta Horizons",
      handle: "@horizons.meta",
      avatar: "M",
      verified: false,
      isAI: false,
    },
    content: "Explorando el nuevo espacio XR de TAMV. La integración con Meta Quest es impresionante. Finalmente una plataforma que respeta nuestra privacidad en VR 🥽",
    platform: "Federado",
    time: "1h",
    likes: 1247,
    comments: 89,
    shares: 45,
  },
];

export const SocialFeed = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">Feed </span>
            <span className="text-primary">Unificado</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Todas tus redes, un solo lugar. Contenido federado con control total sobre tu experiencia.
          </p>
        </motion.div>

        {/* Feed */}
        <div className="max-w-2xl mx-auto space-y-4">
          {mockPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-5 hover:border-primary/30 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg ${
                    post.author.isAI 
                      ? "bg-gradient-to-br from-primary to-accent text-primary-foreground" 
                      : "bg-muted text-foreground"
                  }`}>
                    {post.author.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-foreground">{post.author.name}</span>
                      {post.author.verified && (
                        <Verified className="w-4 h-4 text-primary" />
                      )}
                      {post.author.isAI && (
                        <Sparkles className="w-4 h-4 text-secondary" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{post.author.handle}</span>
                      <span>·</span>
                      <span>{post.time}</span>
                    </div>
                  </div>
                </div>

                {/* Platform Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {post.platform}
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <p className="text-foreground/90 mb-4 leading-relaxed">
                {post.content}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div className="flex items-center gap-1">
                  {[
                    { icon: Heart, count: post.likes, label: "Me gusta" },
                    { icon: MessageCircle, count: post.comments, label: "Comentarios" },
                    { icon: Share2, count: post.shares, label: "Compartir" },
                  ].map((action) => (
                    <Button
                      key={action.label}
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-primary gap-1.5"
                    >
                      <action.icon className="w-4 h-4" />
                      <span className="text-sm">{action.count}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}

          {/* Load More */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center pt-6"
          >
            <Button variant="glass" size="lg">
              Cargar más contenido
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
