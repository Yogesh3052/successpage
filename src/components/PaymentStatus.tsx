import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ApiResponse {
  status: string;
  subscription_id: string;
  payment_details: {
    status: string;
    message: string;
    payment_id: string;
    payment_method: string;
    payment_completion_time: string;
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
          status: 'error',
          subscription_id: '',
          payment_details: {
            status: 'ERROR',
            message: 'Payment ID is missing',
            payment_id: '',
            payment_method: '',
            payment_completion_time: ''
          }
        });
        setLoading(false);
        return;
      }

      const MAX_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds
      const POLL_INTERVAL = 5 * 1000; // 5 seconds in milliseconds
      let timeoutId: NodeJS.Timeout;
      let intervalId: NodeJS.Timeout;

      const checkPaymentStatus = async () => {
        try {
          const response = await fetch(`https://aiservice-paymentgateway.up.railway.app/paymentstatus/${paymentId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Origin': window.location.origin
            },
          });

          const data = await response.json();
          console.log('Status code:', response.status);
          console.log('Raw API Response:', JSON.stringify(data, null, 2));

          if (response.status === 200) {
            // Success case - payment is complete and DB is updated
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            setApiResponse(data);
            setLoading(false);
          } else if (response.status === 400) {
            // Error case - payment failed
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            setApiResponse({
              status: 'error',
              subscription_id: '',
              payment_details: {
                status: 'ERROR',
                message: 'Payment verification failed',
                payment_id: '',
                payment_method: '',
                payment_completion_time: ''
              }
            });
            setLoading(false);
          } else if (response.status === 409) {
            // Continue polling - payment is successful but DB not updated
            console.log('Payment successful but DB not updated yet, continuing to poll...');
          } else {
            // Handle other status codes
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            setApiResponse({
              status: 'error',
              subscription_id: '',
              payment_details: {
                status: 'ERROR',
                message: `Unexpected status code: ${response.status}`,
                payment_id: '',
                payment_method: '',
                payment_completion_time: ''
              }
            });
            setLoading(false);
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          clearInterval(intervalId);
          clearTimeout(timeoutId);
          setApiResponse({
            status: 'error',
            subscription_id: '',
            payment_details: {
              status: 'ERROR',
              message: error instanceof Error ? error.message : 'Unknown error occurred',
              payment_id: '',
              payment_method: '',
              payment_completion_time: ''
            }
          });
          setLoading(false);
        }
      };

      // Start polling
      intervalId = setInterval(checkPaymentStatus, POLL_INTERVAL);

      // Set timeout for 5 minutes
      timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        setApiResponse({
          status: 'error',
          subscription_id: '',
          payment_details: {
            status: 'ERROR',
            message: 'Please Contact support and raise a query',
            payment_id: '',
            payment_method: '',
            payment_completion_time: ''
          }
        });
        setLoading(false);
      }, MAX_TIMEOUT);

      // Initial check
      checkPaymentStatus();

      // Cleanup function
      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
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

  const status = apiResponse?.status || 'error';
  const paymentStatus = apiResponse?.payment_details?.status || 'ERROR';
  const message = apiResponse?.payment_details?.message || 'No response received';
  const isSuccess = status === 'success' && paymentStatus === 'SUCCESS';

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
          <button className="text-green-500 hover:text-green-600" onClick={() => {
            window.location.href = 'http://13.127.169.173';
          }}>
            Go to Dashboard
          </button>
          <p className="mt-4 text-lg text-muted-foreground">
            {message}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Status: {paymentStatus}
          </p>
          {isSuccess && (
            <div className="mt-6 text-left space-y-2">
              <div className="border-t pt-4">
                <h3 className="font-semibold text-foreground mb-3">Payment Details</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Subscription ID:</span> {apiResponse?.subscription_id}</p>
                  <p><span className="text-muted-foreground">Payment ID:</span> {apiResponse?.payment_details?.payment_id}</p>
                  <p><span className="text-muted-foreground">Payment Method:</span> {apiResponse?.payment_details?.payment_method}</p>
                  <p><span className="text-muted-foreground">Payment Time:</span> {new Date(apiResponse?.payment_details?.payment_completion_time || '').toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PaymentStatus; 