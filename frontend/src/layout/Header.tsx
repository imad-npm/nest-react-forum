import { Link } from 'react-router-dom';
import { useAppSelector } from '../shared/stores/hooks';
import LogoutButton from '../features/auth/components/LogoutButton';

const Header = () => {
  const { accessToken } = useAppSelector((state) => state.auth);

  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {accessToken ? (
            <li>
              <LogoutButton />
            </li>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
