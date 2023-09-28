import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import { BrowserRouter as Router } from 'react-router-dom';
import AppNavbar from '../components/Navbar';
import Auth from '../utils/auth';

jest.mock('../utils/auth', () => ({
    loggedIn: jest.fn(() => false), // default behavior
    logout: jest.fn(),
  }));
  
  describe('AppNavbar', () => {
    // ...
  
    test('shows login/signup when user is not logged in', () => {
      render(
        <Router>
          <AppNavbar />
        </Router>
      );
      
      expect(screen.getByText(/login\/sign up/i)).toBeInTheDocument();
    });
    
    test('shows saved books and logout when user is logged in', () => {
      Auth.loggedIn.mockImplementation(() => true); // Override the default behavior
      
      render(
        <Router>
          <AppNavbar />
        </Router>
      );
      
      expect(screen.getByText(/see your books/i)).toBeInTheDocument();
      expect(screen.getByText(/logout/i)).toBeInTheDocument();
    });
    
    // ...
  });