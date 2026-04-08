import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { AlertTriangle } from 'lucide-react';

export function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">404</h1>
          <h2 className="text-xl font-semibold text-slate-900">Page Not Found</h2>
          <p className="text-slate-500">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Link to="/">
          <Button size="lg">Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
