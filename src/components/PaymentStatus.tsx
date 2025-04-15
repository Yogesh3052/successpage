import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorCode, setErrorCode] = useState<number | null>(null);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Replace this URL with your actual endpoint
        const response = await fetch('YOUR_ENDPOINT_URL', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // Add any necessary payment data from the URL parameters
            paymentId: searchParams.get('payment_id'),
            // Add other relevant parameters
          }),
        });

        if (response.status === 200) {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorCode(response.status);
        }
      } catch (error) {
        setStatus('error');
        setErrorCode(500);
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="max-w-md w-full p-8">
        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Processing payment...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-16 h-16 text-green-500 dark:text-green-400" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-foreground">Payment Successful!</h2>
            <p className="mt-2 text-muted-foreground">Your payment has been processed successfully.</p>
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
            <h2 className="mt-4 text-2xl font-bold text-foreground">Payment Failed</h2>
            <p className="mt-2 text-muted-foreground">There was an error processing your payment.</p>
            {errorCode && (
              <p className="mt-2 text-sm text-muted-foreground">Error Code: {errorCode}</p>
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