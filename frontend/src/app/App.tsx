import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { AppProvider, useApp } from './lib/store';
import { Login } from './pages/Login';

function MainApp() {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <Login />;
  }

  return <RouterProvider router={router} />;
}

function App() {
  return (
    <AppProvider>
      <MainApp />
      <Toaster richColors position="top-right" />
    </AppProvider>
  );
}

export default App;
