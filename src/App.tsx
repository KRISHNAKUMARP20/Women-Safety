import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { EmergencyProvider } from './context/EmergencyContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EmergencyProvider>
          <AppRoutes />
        </EmergencyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
