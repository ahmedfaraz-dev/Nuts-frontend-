import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const error = searchParams.get('error') || 'Authentication failed';
  const errorDescription = searchParams.get('error_description') || 'An error occurred during authentication';

  useEffect(() => {
    // Auto-redirect to login after 5 seconds
    const timer = setTimeout(() => {
      navigate('/login', { replace: true });
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center bg-red-50 border border-red-200 rounded-2xl p-10 shadow-sm">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-[#272727] mb-3">Authentication Failed</h2>
        
        <div className="space-y-3 mb-8">
          <p className="text-red-600 font-medium">{error}</p>
          <p className="text-gray-500 text-sm">{errorDescription}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/login', { replace: true })}
            className="w-full bg-[#F59115] hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
          >
            Try Again
          </button>
          
          <p className="text-xs text-gray-400">
            You will be redirected to the login page automatically in 5 seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

export default OAuthFailed;
