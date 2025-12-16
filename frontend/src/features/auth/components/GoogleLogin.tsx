const GoogleLogin = () => {
  const googleLogin = () => {
    window.location.href = 'http://localhost:3000/api/auth/google';
  };

  return (
    <button onClick={googleLogin}>
      Login with Google
    </button>
  );
};

export default GoogleLogin;
