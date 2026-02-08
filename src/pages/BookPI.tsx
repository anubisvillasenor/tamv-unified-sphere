import { motion } from 'framer-motion';
import { 
  Shield, Database, Link2, Hash, Clock,
  CheckCircle, AlertTriangle, Activity, Blocks
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useBookPI } from '@/hooks/useBookPI';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const BookPI = () => {
  const { entries, stats, entityTypes, isLoading } = useBookPI(100);

  const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case 'CREATE': return 'bg-green-500/20 text-green-400';
      case 'UPDATE': return 'bg-blue-500/20 text-blue-400';
      case 'DELETE': return 'bg-red-500/20 text-red-400';
      case 'TRANSFER': return 'bg-[hsl(var(--tamv-gold))]/20 text-[hsl(var(--tamv-gold))]';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getEntityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'post': return '📝';
      case 'user': return '👤';
      case 'transaction': return '💰';
      case 'artwork': return '🎨';
      case 'course': return '📚';
      case 'stream': return '📺';
      default: return '📦';
    }
  };

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
            <Blocks className="w-4 h-4" />
            <span className="text-sm font-medium">BLOCKCHAIN LEDGER</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">BookPI</span> Ledger
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Registro inmutable de todas las operaciones del ecosistema TAMV.
            Transparencia, trazabilidad y seguridad civilizatoria.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-[hsl(var(--tamv-primary))]/20">
                  <Blocks className="w-6 h-6 text-[hsl(var(--tamv-primary))]" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.totalBlocks || 0}</p>
                  <p className="text-sm text-muted-foreground">Bloques totales</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-500/20">
                  <Database className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.totalEntities || 0}</p>
                  <p className="text-sm text-muted-foreground">Tipos de entidad</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-500/20">
                  <Clock className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">
                    {stats?.lastBlockTime 
                      ? formatDistanceToNow(new Date(stats.lastBlockTime), { addSuffix: true, locale: es })
                      : 'N/A'
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">Último bloque</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${stats?.chainIntegrity ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  {stats?.chainIntegrity ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold">
                    {stats?.chainIntegrity ? 'Verificada' : 'Error'}
                  </p>
                  <p className="text-sm text-muted-foreground">Integridad</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Ledger */}
          <div className="lg:col-span-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[hsl(var(--tamv-primary))]" />
                  Registro de Operaciones
                </CardTitle>
                <CardDescription>
                  Últimas {entries?.length || 0} transacciones registradas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="animate-pulse flex gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-muted" />
                        <div className="flex-1">
                          <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                          <div className="h-3 bg-muted rounded w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : entries && entries.length > 0 ? (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {entries.map((entry, idx) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="text-2xl">{getEntityIcon(entry.entity_type)}</div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getActionColor(entry.action)}>
                              {entry.action}
                            </Badge>
                            <span className="text-sm font-medium">{entry.entity_type}</span>
                            <span className="text-xs text-muted-foreground">
                              #{entry.block_number || 0}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Hash className="w-3 h-3" />
                            <span className="font-mono truncate max-w-[200px]">
                              {entry.data_hash}
                            </span>
                          </div>
                          
                          {entry.prev_hash && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <Link2 className="w-3 h-3" />
                              <span className="font-mono truncate max-w-[150px]">
                                ← {entry.prev_hash}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          {entry.timestamp 
                            ? formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true, locale: es })
                            : 'N/A'
                          }
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Database className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No hay registros en el ledger</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Distribución por tipo */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Distribución por Entidad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {entityTypes?.map((type) => (
                  <div key={type.type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="flex items-center gap-2">
                        <span>{getEntityIcon(type.type)}</span>
                        <span className="capitalize">{type.type}</span>
                      </span>
                      <span className="text-muted-foreground">{type.count}</span>
                    </div>
                    <Progress 
                      value={(type.count / (stats?.totalBlocks || 1)) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Info del protocolo */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[hsl(var(--tamv-gold))]" />
                  Protocolo IMMORTAL CORE
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Algoritmo</span>
                  <span className="font-mono">SHA-256</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Consenso</span>
                  <span>Proof of Authority</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Red</span>
                  <span>TAMV Mainnet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado</span>
                  <Badge className="bg-green-500/20 text-green-400">Activo</Badge>
                </div>
              </CardContent>
            </Card>

            {/* MSR Token */}
            <Card className="glass-card bg-gradient-to-br from-[hsl(var(--tamv-gold))]/10 to-transparent">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <span className="text-2xl">🪙</span>
                  Token MSR
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Moneda de servicio del ecosistema TAMV
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Precio</span>
                    <span className="font-bold text-[hsl(var(--tamv-gold))]">$0.15 USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Circulante</span>
                    <span>10M MSR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Market Cap</span>
                    <span>$1.5M USD</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookPI;
