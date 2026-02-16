import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sounds } from '@/lib/sounds';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    sounds.purchase();
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-10 text-center max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        </motion.div>
        <h1 className="text-3xl font-bold text-foreground mb-3">¡Pago Exitoso!</h1>
        <p className="text-muted-foreground mb-8">
          Tu transacción ha sido procesada. Ya tienes acceso a tu contenido.
        </p>
        <div className="flex flex-col gap-3">
          <Button variant="tamv" size="lg" className="gap-2" onClick={() => navigate('/university')}>
            Ir a Universidad <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="glass" onClick={() => navigate('/feed')}>
            Volver al Feed
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
