import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { submitPreorder } from "@/lib/api";

// Integrates with backend preorder endpoint
export function usePreOrder() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: submitPreorder,
    onSuccess: () => {
      toast({
        title: "Pre-order confirmed!",
        description: "You're on the list. We'll notify you when SURGE is ready to ship.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Something went wrong",
        description: error.message || "Please check your details and try again.",
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
