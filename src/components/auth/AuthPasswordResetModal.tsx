
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface AuthPasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthPasswordResetModal = ({ isOpen, onClose }: AuthPasswordResetModalProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      // First, check if the email exists by attempting to send reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });

      if (error) {
        // If the error indicates the user doesn't exist, show a custom message
        if (error.message.includes('User not found') || error.message.includes('Invalid email')) {
          setError('This email is not registered. Please enter a valid registered email address.');
        } else {
          throw error;
        }
      } else {
        setMessage('Password reset link has been sent to your email. Please check your inbox.');
        toast.success('Password reset link sent successfully!');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred while sending the reset link.');
      toast.error('Failed to send password reset link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setMessage('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Enter your registered email address to receive a password reset link.
          </DialogDescription>
        </DialogHeader>

        {message && (
          <Alert>
            <AlertDescription className="text-green-600">
              {message}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSendResetLink} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthPasswordResetModal;
