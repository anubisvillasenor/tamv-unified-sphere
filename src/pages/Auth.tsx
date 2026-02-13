import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  Eye, EyeOff, Mail, Lock, User, Fingerprint,
  Shield, Brain, Globe, ArrowLeft
} from 'lucide-react';
import logoTamv from '@/assets/logo-tamv-official.jpg';

const MatrixRain = lazy(() => import("@/components/effects/MatrixRain"));

const ID_NVIDA_FEATURES = [
  { icon: Fingerprint, label: "Identidad soberana e intransferible" },
  { icon: Shield, label: "Protección Zero-Trust por diseño" },
  { icon: Brain, label: "Isabella AI como guardiana ética" },
  { icon: Globe, label: "Acceso a las 7 federaciones" },
];

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, loading } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  useEffect(() => {
    if (user && !loading) {
      navigate('/feed');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast({
            variant: 'destructive',
            title: 'Error de autenticación',
            description: error.message === 'Invalid login credentials'
              ? 'Credenciales inválidas.'
              : error.message
          });
        } else {
          toast({ title: '¡Bienvenido!', description: 'Accediendo al ecosistema TAMV...' });
        }
      } else {
        if (formData.password.length < 6) {
          toast({
            variant: 'destructive',
            title: 'Contraseña muy corta',
            description: 'Mínimo 6 caracteres.'
          });
          setSubmitting(false);
          return;
        }

        const { error } = await signUp(formData.email, formData.password, formData.fullName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({ variant: 'destructive', title: 'Usuario existente', description: 'Intenta iniciar sesión.' });
          } else {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
          }
        } else {
          toast({
            title: '¡ID-NVIDA creada!',
            description: 'Verifica tu email para activar tu identidad digital soberana.'
          });
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      {/* Matrix Background */}
      <Suspense fallback={null}>
        <MatrixRain />
      </Suspense>

      {/* Left Panel - Branding (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 items-center justify-center p-12">
        <div className="max-w-md">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img src={logoTamv} alt="TAMV" className="h-20 w-20 rounded-2xl mb-8 shadow-lg" />
            
            <h2 className="text-4xl font-bold mb-3">
              <span className="text-metallic">ID-NVIDA</span>
            </h2>
            <p className="text-lg text-secondary mb-2">
              Identidad Digital Soberana
            </p>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
              Tu puerta de entrada al ecosistema civilizatorio TAMV.
              Una identidad verificable, intransferible y protegida
              por arquitectura Zero-Trust y gobernanza algorítmica.
            </p>

            <div className="space-y-4">
              {ID_NVIDA_FEATURES.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg glass flex items-center justify-center">
                    <f.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground/80">{f.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass rounded-2xl p-8 border border-border/50">
            {/* Mobile logo */}
            <div className="text-center mb-8 lg:hidden">
              <img src={logoTamv} alt="TAMV" className="h-14 mx-auto mb-3 rounded-xl" />
            </div>

            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-foreground">
                {isLogin ? 'Acceder al Ecosistema' : 'Crear ID-NVIDA'}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {isLogin ? 'Ingresa con tu identidad digital' : 'Registro de identidad digital soberana'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs text-muted-foreground">
                    Nombre completo
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      placeholder="Tu nombre"
                      className="pl-10 bg-muted/50 border-border"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs text-muted-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="pl-10 bg-muted/50 border-border"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs text-muted-foreground">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-muted/50 border-border"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="tamv"
                size="lg"
                className="w-full gap-2 mt-2"
                disabled={submitting}
              >
                <Fingerprint className="h-4 w-4" />
                {submitting ? 'Procesando...' : (isLogin ? 'Acceder' : 'Registrar ID-NVIDA')}
              </Button>
            </form>

            {/* Separator */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {isLogin ? 'Nuevo en TAMV' : 'Ya tienes ID-NVIDA'}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Toggle */}
            <Button
              variant="glass"
              size="default"
              className="w-full"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Crear Identidad Digital' : 'Iniciar Sesión'}
            </Button>

            {/* Back */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mx-auto"
              >
                <ArrowLeft className="w-3 h-3" />
                Volver al inicio
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
