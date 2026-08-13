import { env } from '@/config/env';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const timeoutMs = Number(env.TIMEOUT_UI);
  const [secondsRemaining, setSecondsRemaining] = useState(Math.ceil(timeoutMs / 1000));

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      navigate('/', { replace: true });
    }, timeoutMs);

    return () => window.clearTimeout(timeout);
  }, [navigate, timeoutMs]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSecondsRemaining((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you are looking for does not exist. <br />Redirecting in {secondsRemaining} seconds.
      </p>
    </div>
  );
}
