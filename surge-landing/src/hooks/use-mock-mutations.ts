import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Simulates a pre-order API call
export function usePreOrder() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: { name: string; email: string; quantity: number }) => {
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (!data.email.includes("@")) throw new Error("Invalid email");
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Pre-order confirmed!",
        description: "You're on the list. We'll notify you when SURGE is ready to ship.",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please check your details and try again.",
        variant: "destructive",
      });
    }
  });
}

// Simulates a newsletter signup API call
export function useNewsletterSignup() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (email: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!email.includes("@")) throw new Error("Invalid email");
      return email;
    },
    onSuccess: () => {
      toast({
        title: "Welcome to the SURGE community!",
        description: "Get ready for exclusive plant-based nutrition tips.",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Invalid email",
        description: "Please provide a valid email address.",
        variant: "destructive",
      });
    }
  });
}
