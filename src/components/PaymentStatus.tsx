import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ApiResponse {
  detail: {
    status: string;
    message: string;
  };
}

const PaymentStatus = () => {
  const { paymentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!paymentId) {
        setApiResponse({
          detail: {
            status: 'ERROR',
            message: 'Payment ID is missing'
          }
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const response = await fetch(`https://aiservice-paymentgateway.up.railway.app/paymentstatus/${paymentId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': window.location.origin
          },
        });

        const data = await response.json();
        setApiResponse(data);
        console.log(data);
        setLoading(false);
        
      } catch (error) {
        console.error('Payment verification error:', error);
        setApiResponse({
          detail: {
            status: 'ERROR',
            message: error instanceof Error ? error.message : 'Unknown error occurred'
          }
        });
        setLoading(false);
      }
    };

    verifyPayment();
  }, [paymentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Verifying payment status...</p>
            <p className="mt-2 text-sm text-muted-foreground">Payment ID: {paymentId}</p>
          </div>
        </Card>
      </div>
    );
  }

  const status = apiResponse?.detail?.status || 'UNKNOWN';
  const message = apiResponse?.detail?.message || 'No response received';
  const isSuccess = status === 'SUCCESS';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="max-w-md w-full p-8">
        <div className="text-center">
          <div className={`w-24 h-24 rounded-full ${isSuccess ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'} flex items-center justify-center mx-auto`}>
            {isSuccess ? (
              <CheckCircle2 className="w-16 h-16 text-green-500 dark:text-green-400" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500 dark:text-red-400" />
            )}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-foreground">
            {isSuccess ? 'Success' : 'Failed'}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {message}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PaymentStatus; 