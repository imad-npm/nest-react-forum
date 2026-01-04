import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Label } from '../../../shared/components/ui/Label';
import { InputError } from '../../../shared/components/ui/InputError';
import { useResetPasswordMutation } from '../services/authApi';
import { useSearchParams, Link } from 'react-router-dom';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [resetPassword, { isLoading, isSuccess, error }] = useResetPasswordMutation();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordDto>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const handleResetPassword = (data: ResetPasswordDto) => {
    if (token) {
      resetPassword({ token, password: data.password });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg border border-gray-300">
        <h1 className="text-2xl font-bold text-center">Reset Password</h1>
        {isSuccess ? (
          <>   <p className="text-center text-green-600">
            Your password has been reset successfully.
          </p>
          <p className="text-center">
            <Link to="/login" className="text-blue-600 hover:underline">
              Return to Login
            </Link>
          </p>
          </>
       
        ) : (
          <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-6">
            <div>
              <Label htmlFor="password">New Password</Label>
              <Input id="password" type="password" {...formRegister('password')} />
              <InputError message={errors.password?.message} />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...formRegister('confirmPassword')}
              />
              <InputError message={errors.confirmPassword?.message} />
            </div>
            <Button type="submit" disabled={isLoading || !token} className="w-full">
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
            {error && (
              <InputError
                message={
                  (error as any).data?.message ||
                  'An unknown error occurred'
                }
              />
            )}
             {!token && <InputError message="No reset token found in URL." />}
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
