import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Label } from '../../../shared/components/ui/Label';
import { InputError } from '../../../shared/components/ui/InputError';
import { useForgotPasswordMutation } from '../services/authApi';
import { Link } from 'react-router-dom';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [forgotPassword, { isLoading, isSuccess, error }] = useForgotPasswordMutation();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordDto>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const handleForgotPassword = (data: ForgotPasswordDto) => {
    forgotPassword(data);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg border border-gray-300">
        <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
        {isSuccess ? (<>
            <p className="text-center text-green-600">
            An email has been sent with instructions to reset your password.
          </p>
          <p className="text-center">
            <Link to="/login" className="text-blue-600 hover:underline">
              Return to Login
            </Link>
          </p>
        </>
      
        ) : (
          <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" {...formRegister('email')} />
              <InputError message={errors.email?.message} />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
            {error && (
              <InputError
                message={
                  (error as any).data?.message ||
                  'An unknown error occurred'
                }
              />
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
