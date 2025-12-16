import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegisterMutation } from '../services/authApi';
import type { RegisterDto } from '../types';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { useToastContext } from '../../../shared/providers/ToastProvider';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const Register = () => {
  const [register, { isLoading, error }] = useRegisterMutation();
  const { showToast } = useToastContext();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDto>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterDto) => {
    try {
      const response = await register(data).unwrap();
      showToast(response.message, 'success');
    } catch (err: any) {
      const errorMessage = err.data?.message || err.message || 'Unknown error';
      showToast(errorMessage, 'error');
      console.error('Failed to register: ', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Register</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name">Name</label>
            <Input id="name" {...formRegister('name')} />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <Input id="email" {...formRegister('email')} />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <Input id="password" type="password" {...formRegister('password')} />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
          {error && (
            <p className="text-red-500">
              An error occurred: {error.data?.message || error.message || 'Unknown error'}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
