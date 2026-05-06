import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { userApi } from '../Api/userApi';
import { useAuth } from '../contexts/AuthContext';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState('Processing...');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        
        if (!code) {
          throw new Error('Authorization code not found');
        }

        setStatus('Authenticating...');uthRouter.get('/google/callback',
      passport.authenticate('google', { failureRedirect: '/api/v1/auth/google/failed' }),
     googleAuthCallback );
        const data = await userApi.handleGoogleCallback(code, state);
        
        // Store token and user data
        if (data.token) {
          localStorage.setItem('token', data.token);
          document.cookie = `token=${data.token}; path=/; max-age=86400`;
        }
        
        setStatus('Login successful!');
        
        // Redirect based on user role
        setTimeout(() => {
          if (data.user?.role === 'admin') {
            navigate('/admin-dashboard', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }, 1000);
        
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err.message || 'Authentication failed');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          {error ? (
            <div className="text-red-500 text-6xl mb-4">❌</div>
          ) : (
            <div className="text-orange-500 text-6xl mb-4 animate-spin">⚡</div>
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-[#272727] mb-3">
          {error ? 'Authentication Failed' : 'Authenticating...'}
        </h2>
        
        <p className={`text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || status}
        </p>
        
        {!error && (
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[#F59115] h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;
