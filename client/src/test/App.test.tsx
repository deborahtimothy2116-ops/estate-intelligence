import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { SocketProvider } from '../context/SocketContext';
import { ThemeProvider } from '../context/ThemeContext';
import { Navbar } from '../components/Navbar';

describe('Navbar Component Unit Tests', () => {
  it('renders platform branding title', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <SocketProvider>
              <Navbar />
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Estate/i)).toBeDefined();
    expect(screen.getByText(/Intel/i)).toBeDefined();
  });
});
