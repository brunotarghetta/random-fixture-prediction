import { useAuth } from './hooks/useAuth';
import { LoginPage } from './components/LoginPage';
import { MainPage } from './components/MainPage';

function App() {
  const { username, login, logout } = useAuth();

  if (username === null) {
    return <LoginPage onLogin={login} />;
  }

  return <MainPage username={username} onLogout={logout} />;
}

export default App;
