import { Button } from '../../../shared/components/ui/Button';

const GoogleLogin = () => {
  const googleLogin = () => {
    window.location.href = 'http://localhost:3000/api/auth/google';
  };

  return (
    <Button onClick={googleLogin} className="w-full">
      Login with Google
    </Button>
  );
};

export default GoogleLogin;
