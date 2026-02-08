import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Plus, Search, Lock, Globe, 
  Crown, Shield, MessageSquare, Settings
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGroups, Group } from '@/hooks/useGroups';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const GroupCard = ({ group, onJoin, isMember }: { 
  group: Group; 
  onJoin: () => void;
  isMember: boolean;
}) => {
  const navigate = useNavigate();

  return (
    <Card className="glass-card overflow-hidden hover:border-[hsl(var(--tamv-primary))]/50 transition-all hover:shadow-lg cursor-pointer">
      {/* Cover */}
      <div className="h-24 bg-gradient-to-r from-[hsl(var(--tamv-primary))]/30 to-[hsl(var(--tamv-accent))]/30 relative">
        {group.cover_url && (
          <img src={group.cover_url} alt="" className="w-full h-full object-cover" />
        )}
        {group.is_verified && (
          <Badge className="absolute top-2 right-2 bg-[hsl(var(--tamv-primary))]">
            <Shield className="w-3 h-3 mr-1" />
            Verificado
          </Badge>
        )}
      </div>

      <CardContent className="p-4 pt-0 relative">
        {/* Avatar del grupo */}
        <Avatar className="w-16 h-16 border-4 border-background -mt-8 relative z-10">
          <AvatarImage src={group.avatar_url || ''} />
          <AvatarFallback className="bg-[hsl(var(--tamv-primary))] text-lg">
            {group.name[0]}
          </AvatarFallback>
        </Avatar>

        <div className="mt-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">{group.name}</h3>
            {!group.is_public && <Lock className="w-4 h-4 text-muted-foreground" />}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {group.description || 'Sin descripción'}
          </p>
        </div>

        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {group.member_count || 0} miembros
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            {group.post_count || 0} posts
          </span>
        </div>

        <div className="flex gap-2 mt-4">
          {isMember ? (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => navigate(`/groups/${group.slug}`)}
            >
              Abrir Grupo
            </Button>
          ) : (
            <Button 
              className="flex-1 bg-[hsl(var(--tamv-primary))]"
              onClick={onJoin}
            >
              Unirse
            </Button>
          )}
        </div>

        <Badge variant="secondary" className="mt-3">
          {group.category || 'General'}
        </Badge>
      </CardContent>
    </Card>
  );
};

const CreateGroupDialog = () => {
  const { createGroup } = useGroups();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [isPublic, setIsPublic] = useState(true);

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
  };

  const handleCreate = () => {
    createGroup.mutate({ 
      name, 
      slug, 
      description, 
      category,
      is_public: isPublic 
    }, {
      onSuccess: () => {
        setOpen(false);
        setName('');
        setSlug('');
        setDescription('');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[hsl(var(--tamv-primary))]">
          <Plus className="w-4 h-4 mr-2" />
          Crear Grupo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nueva Comunidad</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Nombre del grupo</label>
            <Input 
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ej: Desarrolladores TAMV"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">URL del grupo</label>
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">tamv.online/groups/</span>
              <Input 
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="mi-grupo"
                className="flex-1"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Descripción</label>
            <Textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="¿De qué trata tu grupo?"
              rows={3}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Categoría</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 rounded-md border bg-background"
            >
              <option value="general">General</option>
              <option value="tecnologia">Tecnología</option>
              <option value="arte">Arte & Diseño</option>
              <option value="negocios">Negocios</option>
              <option value="educacion">Educación</option>
              <option value="gaming">Gaming</option>
              <option value="musica">Música</option>
              <option value="ciencia">Ciencia</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                checked={isPublic} 
                onChange={() => setIsPublic(true)}
              />
              <Globe className="w-4 h-4" />
              <span className="text-sm">Público</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                checked={!isPublic} 
                onChange={() => setIsPublic(false)}
              />
              <Lock className="w-4 h-4" />
              <span className="text-sm">Privado</span>
            </label>
          </div>

          <Button 
            onClick={handleCreate}
            disabled={!name || !slug || createGroup.isPending}
            className="w-full bg-[hsl(var(--tamv-primary))]"
          >
            {createGroup.isPending ? 'Creando...' : 'Crear Comunidad'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Groups = () => {
  const { user } = useAuth();
  const { groups, myGroups, isLoading, joinGroup } = useGroups();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'discover' | 'my'>('discover');

  const filteredGroups = (activeTab === 'my' ? myGroups : groups)?.filter(
    g => g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const myGroupIds = new Set(myGroups?.map(g => g.id));

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--tamv-primary))]/10 text-[hsl(var(--tamv-primary))] mb-4">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">COMUNIDADES</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Grupos <span className="gradient-text">TAMV</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Únete a comunidades de creadores, desarrolladores, artistas y visionarios.
            Conecta con personas que comparten tu pasión.
          </p>
        </motion.div>

        {/* Controles */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar comunidades..."
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={activeTab === 'discover' ? 'default' : 'outline'}
              onClick={() => setActiveTab('discover')}
            >
              Descubrir
            </Button>
            <Button 
              variant={activeTab === 'my' ? 'default' : 'outline'}
              onClick={() => setActiveTab('my')}
            >
              Mis Grupos
            </Button>
          </div>

          {user && <CreateGroupDialog />}
        </div>

        {/* Grid de grupos */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-24 bg-muted" />
                <CardContent className="p-4">
                  <div className="w-16 h-16 rounded-full bg-muted -mt-8" />
                  <div className="h-5 bg-muted rounded w-1/2 mt-3" />
                  <div className="h-4 bg-muted rounded w-full mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredGroups && filteredGroups.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <GroupCard 
                key={group.id} 
                group={group}
                isMember={myGroupIds.has(group.id)}
                onJoin={() => joinGroup.mutate(group.id)}
              />
            ))}
          </div>
        ) : (
          <Card className="glass-card p-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">
              {activeTab === 'my' ? 'No te has unido a ningún grupo' : 'No se encontraron grupos'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {activeTab === 'my' 
                ? 'Explora las comunidades disponibles y únete'
                : 'Sé el primero en crear una comunidad'
              }
            </p>
            {user && activeTab === 'discover' && <CreateGroupDialog />}
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Groups;
