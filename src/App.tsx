import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PaymentStatus from '@/components/PaymentStatus';
import './App.css';

function PaymentResult({ status }: { status: 'success' | 'failure' }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md p-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.4
              }}
              className="mb-6"
            >
              {status === 'success' ? (
                <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <CheckCircle2 className="w-16 h-16 text-green-500 dark:text-green-400" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <XCircle className="w-16 h-16 text-red-500 dark:text-red-400" />
                </div>
              )}
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-3xl font-bold mb-4 text-foreground"
            >
              {status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-muted-foreground mb-8"
            >
              {status === 'success'
                ? 'Thank you for your payment. Your transaction has been completed successfully.'
                : 'Sorry, there was a problem processing your payment. Please try again.'}
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex gap-4"
            >
              <Button
                variant={status === 'success' ? 'default' : 'destructive'}
                className="gap-2"
                onClick={() => {
                  if (status === 'success') {
                    window.location.href = '/dashboard';
                  } else {
                    window.location.href = '/checkout';
                  }
                }}
              >
                {status === 'success' ? 'Go to Dashboard' : 'Try Again'}
                {status === 'success' ? <ArrowRight className="w-4 h-4" /> : <RefreshCcw className="w-4 h-4" />}
              </Button>
            </motion.div>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}

function App() {
  return (
    <div className="dark">
      <Router>
        <Routes>
          <Route path="/:paymentId" element={<PaymentStatus />} />
          <Route path="/" element={<PaymentResult status="success" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;