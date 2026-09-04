import { Button } from '../../../shared/components/ui/Button';

const GoogleLogin = () => {
  const googleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <Button onClick={googleLogin} className="w-full">
      Login with Google
    </Button>
  );
};

export default GoogleLogin;