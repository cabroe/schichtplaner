import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ShiftPlanning from './ShiftPlanning';

// Mock der userService
vi.mock('../services/users', () => ({
  userService: {
    getUsers: vi.fn().mockResolvedValue({
      data: [
        {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          name: 'Test User',
          color: '#ff0000',
          role: 'employee',
          personalnummer: 'EMP001',
          accountNumber: 'ACC001',
          isActive: true,
          isAdmin: false,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        }
      ],
      pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      success: true
    })
  }
}));

describe('ShiftPlanning', () => {
  it('rendert ohne Fehler', async () => {
    render(
      <BrowserRouter>
        <ShiftPlanning />
      </BrowserRouter>
    );

    // Warte auf das Laden der Benutzer
    await screen.findByText('Schichtplanung');
    
    expect(screen.getByText('Schichtplanung')).toBeInTheDocument();
  });
}); 