import { useAppSelector } from '../shared/stores/hooks';

const Home = () => {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <div>
      <h1>Welcome to the forum, {user?.name}!</h1>
    </div>
  );
};

export default Home;