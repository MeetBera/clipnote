  // LoginPrompt.tsx
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Link } from "react-router-dom";

  export const LoginPrompt = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md rounded-2xl shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Login Required</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">You need to sign in to access this feature.</p>
          <div className="flex justify-end gap-3 mt-4">
            <Link to="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-primary to-green-600 text-white rounded-full">
                Get Started
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
