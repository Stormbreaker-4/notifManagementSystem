import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoginPage from './LoginPage';

// Mock navigation and toast
const mockNavigate = jest.fn();
const mockToastPromise = jest.fn();
const mockToastSuccess = jest.fn();

// ✅ Proper full mock for react-hot-toast default export
jest.mock('react-hot-toast', () => {
    const mockToast = {
        promise: (promise, msgs) => {
            mockToastPromise(promise, msgs);
            return promise.catch(() => { }); // safely swallow rejection
        },
        success: (msg) => mockToastSuccess(msg),
        error: jest.fn(),
    };
    return {
        __esModule: true,
        default: mockToast,
        Toaster: () => <div data-testid="toaster" />,
    };
});

// ✅ Mock react-router-dom’s useNavigate
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Helper to render component with context
const renderWithContext = (mockLoginFn) => {
    return render(
        <AuthContext.Provider value={{ login: mockLoginFn }}>
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        </AuthContext.Provider>
    );
};

describe('LoginPage', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
        mockToastPromise.mockClear();
        mockToastSuccess.mockClear();
    });

    test('renders all form fields and button', () => {
        renderWithContext(jest.fn());
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    test('calls login function and navigates on successful login', async () => {
        const mockLogin = jest.fn().mockResolvedValue({ name: 'Test User' });
        renderWithContext(mockLogin);

        const email = 'test@example.com';
        const password = 'password123';

        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: email } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: password } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith(email, password);
            expect(mockToastPromise).toHaveBeenCalled();
            expect(mockToastSuccess).toHaveBeenCalledWith('Welcome back, Test User!');
            expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
        });
    });

    test('shows error on failed login', async () => {
        const mockLogin = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
        renderWithContext(mockLogin);

        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'wrongpassword' },
        });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(mockToastPromise).toHaveBeenCalled();
        });

        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
