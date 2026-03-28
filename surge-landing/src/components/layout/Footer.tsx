import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNewsletterSignup } from "@/hooks/use-mock-mutations";
import { Loader2 } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const mutation = useNewsletterSignup();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(email, {
      onSuccess: () => setEmail("")
    });
  };

  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Col */}
          <div className="md:col-span-4 lg:col-span-4 space-y-6">
            <a href="#" className="flex items-center gap-2 group inline-block">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <span className="font-display font-black text-2xl tracking-wider text-white">SURGE</span>
            </a>
            <p className="text-muted-foreground pr-4">
              Plant-powered protein snacks engineered for performance. Zero compromises, zero animal products, maximum results.
            </p>
          </div>

          {/* Links Col */}
          <div className="md:col-span-3 lg:col-span-3">
            <h4 className="font-display text-lg font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {['Shop', 'About Us', 'Sustainability', 'FAQ', 'Careers'].map(link => (
                <li key={link}>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Col */}
          <div className="md:col-span-5 lg:col-span-5 bg-white/5 rounded-3xl p-8 border border-white/10">
            <h4 className="font-display text-lg font-bold text-white mb-2">Join the Movement</h4>
            <p className="text-sm text-muted-foreground mb-6">
              Get exclusive offers, new flavors, and plant-based nutrition tips straight to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-black/50 border-white/10 h-12"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="h-12 w-full sm:w-auto px-8 shrink-0" disabled={mutation.isPending}>
                {mutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Join"}
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SURGE Nutrition. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
