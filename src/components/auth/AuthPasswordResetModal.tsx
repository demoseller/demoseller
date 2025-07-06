
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

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      // Use signInWithPassword with a dummy password to check if email exists
      // This will fail but give us info about whether the email is registered
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'dummy-password-for-check-only'
      });

      // If error message indicates invalid credentials, email exists but password is wrong
      if (error && error.message.includes('Invalid login credentials')) {
        return true;
      }

      // If error message indicates email not confirmed or user not found
      if (error && (
        error.message.includes('Email not confirmed') ||
        error.message.includes('User not found') ||
        error.message.includes('Invalid email')
      )) {
        return false;
      }

      // For any other error, we assume email doesn't exist
      return false;
    } catch (error: any) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      // First check if email exists
      const emailExists = await checkEmailExists(email);
      
      if (!emailExists) {
        setError('This email address is not registered. Please check your email or sign up for a new account.');
        toast.error('Email not found');
        return;
      }

      // If email exists, send reset link
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });

      if (error) {
        throw error;
      }

      setMessage('Password reset link has been sent to your email. Please check your inbox and follow the instructions.');
      toast.success('Password reset link sent successfully!');
      
      // Clear the form
      setEmail('');
      
    } catch (error: any) {
      console.error('Password reset error:', error);
      setError('Unable to send password reset link. Please try again later.');
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
                disabled={isLoading}
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
