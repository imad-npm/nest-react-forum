import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { LoginDto } from '../types';
import GoogleLogin from '../components/GoogleLogin';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Label } from '../../../shared/components/ui/Label';
import { InputError } from '../../../shared/components/ui/InputError';
import { useAuth } from '../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const Login = () => {
  const { handleLogin, isLoggingIn, loginError } = useAuth();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg border border-gray-300">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" {...formRegister('email')} />
            <InputError message={errors.email?.message} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...formRegister('password')} />
            <InputError message={errors.password?.message} />
          </div>
          <Button type="submit" disabled={isLoggingIn} className="w-full">
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </Button>
          {loginError && (
            <InputError
              message={
                (loginError as any).data?.message ||
                (loginError as any).message ||
                'Unknown error'
              }
            />
          )}
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>
        <GoogleLogin />
      </div>
    </div>
  );
};

export default Login;
