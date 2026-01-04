import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { setAccessToken } from '../stores/authSlice'; // Import setAccessToken action

const GoogleAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize useDispatch

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('accessToken');

    if (accessToken) {
      dispatch(setAccessToken(accessToken)); // Dispatch the action to set the token
      navigate('/'); // Redirect to home page
    } else {
      // Handle error: No access token found, redirect to login or show error
      console.error('Google OAuth callback: No access token found.');
      navigate('/login'); // Redirect to login page
    }
  }, [location, navigate, dispatch]); // Add dispatch to dependency array

  return (
    <div>
      <p>Processing Google login...</p>
      {/* You can add a spinner or loading indicator here */}
    </div>
  );
};

export default GoogleAuthCallback;
