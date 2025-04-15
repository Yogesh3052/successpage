import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PaymentStatus = () => {
  const { paymentId } = useParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorCode, setErrorCode] = useState<number | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!paymentId) {
        setStatus('error');
        setErrorCode(400);
        return;
      }

      try {
        // First set to loading state
        setStatus('loading');
        
        // Make the API call with the payment ID from URL
        const response = await fetch(`https://paymentstatus.up.railway.app/paymentstatus/verify/${paymentId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Simply check the status code
        if (response.status === 200) {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorCode(response.status);
        }
      } catch (error) {
        // Handle network or other errors
        console.error('Payment verification error:', error);
        setStatus('error');
        setErrorCode(500);
      }
    };

    // Call the verification function immediately
    verifyPayment();
  }, [paymentId]); // Only re-run if paymentId changes

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="max-w-md w-full p-8">
        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Verifying payment status...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-16 h-16 text-green-500 dark:text-green-400" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-foreground">Payment Successful!</h2>
            <p className="mt-2 text-muted-foreground">Your payment has been verified successfully.</p>
            <Button className="mt-6 gap-2" onClick={() => window.location.href = '/dashboard'}>
              Go to Dashboard
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto">
              <XCircle className="w-16 h-16 text-red-500 dark:text-red-400" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-foreground">Payment Verification Failed</h2>
            <p className="mt-2 text-muted-foreground">
              {errorCode === 400 
                ? 'Invalid payment ID provided.'
                : errorCode === 500 
                ? 'A server error occurred while verifying the payment.'
                : 'Payment verification failed.'}
            </p>
            {errorCode && (
              <p className="mt-2 text-sm text-muted-foreground">Status Code: {errorCode}</p>
            )}
            <Button variant="destructive" className="mt-6" onClick={() => window.location.href = '/checkout'}>
              Try Again
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PaymentStatus; 