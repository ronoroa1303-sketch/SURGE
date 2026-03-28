import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePreOrder } from "@/hooks/use-mock-mutations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export function PreOrderModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", quantity: 1 });
  const mutation = usePreOrder();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData, {
      onSuccess: () => {
        setTimeout(() => setOpen(false), 2000);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl text-glow">Secure Your SURGE</DialogTitle>
          <DialogDescription className="text-base mt-2">
            Join the elite few who refuse to compromise on nutrition. Pre-order now to get early access and a 15% discount.
          </DialogDescription>
        </DialogHeader>
        
        {mutation.isSuccess ? (
          <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in">
            <div className="mx-auto w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white">You're on the list!</h4>
            <p className="text-muted-foreground">Keep an eye on your inbox.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white/80 mb-1.5 block">Full Name</label>
                <Input 
                  required 
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white/80 mb-1.5 block">Email Address</label>
                <Input 
                  required 
                  type="email" 
                  placeholder="john@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white/80 mb-1.5 block">Boxes to Reserve (12 bars/box)</label>
                <div className="flex items-center gap-4">
                  <Input 
                    type="number" 
                    min="1" 
                    max="10" 
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
                    className="w-24 text-center"
                  />
                  <span className="text-sm text-muted-foreground">No payment required today.</span>
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-14 text-lg" 
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Securing...
                </>
              ) : (
                "Reserve My Order"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
