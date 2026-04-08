import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Activity, Zap, ShieldCheck, ArrowRight, Fingerprint, Mail, Lock, RefreshCw } from 'lucide-react';
import { useApp } from '../lib/store';
import { motion } from 'motion/react';

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
    <div className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden font-sans">
      {/* Immersive Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.15),transparent_70%)]" />
      <div className="absolute top-0 left-0 w-full h-full opacity-20" 
           style={{ backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="flex flex-col items-center mb-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 relative group cursor-none"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl group-hover:bg-primary/40 transition-all duration-500" />
            <div className="relative h-full w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl">
              <Activity className="w-10 h-10 text-primary animate-pulse" />
              <Fingerprint className="absolute w-12 h-12 text-blue-400 opacity-10 blur-[1px]" />
            </div>
          </motion.div>
          
          <h1 className="text-4xl font-black text-white tracking-[0.2em] mt-6 italic glow-text uppercase">
            Fi_NEXUS
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-[1px] w-8 bg-primary/30" />
            <p className="text-[10px] text-primary/60 font-black uppercase tracking-[0.3em]">Neural Command Center</p>
            <div className="h-[1px] w-8 bg-primary/30" />
          </div>
        </div>

        <motion.div
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="glass-panel border-white/5 p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] relative"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white tracking-tight">IDENTITY_VERIFICATION</h2>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1 opacity-60 flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-primary" />
              Secure Terminal Access [SEC-LEVEL-04]
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Personnel_Email</Label>
              <div className="relative group">
                <Input
                  type="email"
                  placeholder="name@nexus.core"
                  required
                  className="bg-white/[0.03] border-white/5 h-12 rounded-xl text-white placeholder:text-white/10 focus-visible:ring-primary/30 pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between pl-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Neural_Key</Label>
                <a href="#" className="text-[9px] text-primary/60 hover:text-primary font-bold uppercase tracking-widest transition-colors">Emergency Overload?</a>
              </div>
              <div className="relative group">
                <Input
                  type="password"
                  placeholder="••••••••"
                  required
                  className="bg-white/[0.03] border-white/5 h-12 rounded-xl text-white placeholder:text-white/10 focus-visible:ring-primary/30 pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] italic rounded-2xl mt-4 transition-all duration-500 shadow-xl shadow-primary/20 group relative overflow-hidden"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  SYNCING_IDENTITY...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  INIT_NEXUS_SYNC
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Button>
          </form>
        </motion.div>

        <div className="mt-10 flex justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
           <div className="flex flex-col items-center gap-2">
              <div className="h-[2px] w-6 bg-primary" />
              <p className="text-[9px] font-black uppercase tracking-[0.3em]">Sentinel_Core</p>
           </div>
           <div className="flex flex-col items-center gap-2">
              <div className="h-[2px] w-6 bg-blue-400" />
              <p className="text-[9px] font-black uppercase tracking-[0.3em]">Fractal_Engine</p>
           </div>
        </div>

        <p className="text-center mt-12 text-white/20 text-[10px] font-bold uppercase tracking-widest">
           TERMINAL_REF: {new Date().getFullYear()} NEXUS_OS_04 // SECURED_BY_SENTINEL
        </p>
      </div>
    </div>
  );
}
