/* eslint-disable import/no-unresolved */
import Router from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import 'src/global.css';
import ThemeProvider from 'src/theme';
import { AuthProvider } from 'src/contexts/AuthContext';
import { AlertProvider } from 'src/contexts/AlertContext';


// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <AlertProvider>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}
