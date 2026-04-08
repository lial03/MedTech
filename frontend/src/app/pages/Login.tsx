import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Activity, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { useApp } from '../lib/store';

export function Login() {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(email, password);
    if (!success) setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
      
      {/* Fractal-like grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 mb-4 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Fi-CMMS</h1>
          <p className="text-slate-400 mt-2 font-medium">Fractal-Informed Management System</p>
        </div>

        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white">Sign In</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your credentials to access the maintenance hub
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@medtech.com"
                  required
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:ring-blue-500 focus:border-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-300">Password</Label>
                  <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  className="bg-slate-800/50 border-slate-700 text-white focus:ring-blue-500 focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-6 mt-2 transition-all duration-300 group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Access Terminal
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 flex flex-col items-center text-center">
            <ShieldCheck className="w-6 h-6 text-emerald-500 mb-2" />
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Secure Access</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 flex flex-col items-center text-center">
            <Zap className="w-6 h-6 text-amber-500 mb-2" />
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">AI Optimized</span>
          </div>
        </div>

        <p className="text-center mt-8 text-slate-500 text-xs">
          &copy; 2026 MedTech Innovators. All rights reserved.
        </p>
      </div>
    </div>
  );
}
