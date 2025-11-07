import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import RegisterPage from './RegisterPage';

// Create mock functions
const mockNavigate = jest.fn();
const mockToastError = jest.fn();
const mockToastPromise = jest.fn();

// Mock react-router-dom BEFORE component import
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockNavigate,
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
	error: (msg) => mockToastError(msg),
	promise: (promise, msgs) => mockToastPromise(promise, msgs),
}));

// Helper: render component with context
const renderWithContext = (mockRegisterFn) => {
	return render(
		<AuthContext.Provider value={{ register: mockRegisterFn }}>
			<BrowserRouter>
				<RegisterPage />
			</BrowserRouter>
		</AuthContext.Provider>
	);
};

describe('RegisterPage', () => {
	beforeEach(() => {
		mockNavigate.mockClear();
		mockToastError.mockClear();
		mockToastPromise.mockClear();
	});

	test('renders all form fields and button', () => {
		renderWithContext(jest.fn());

		expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
		expect(screen.getByPlaceholderText('Mobile Number (+911234567890)')).toBeInTheDocument();
		expect(screen.getByRole('combobox')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
	});

	test('shows validation error for missing name', async () => {
		const mockRegister = jest.fn();
		renderWithContext(mockRegister);

		// Fill all fields except name
		fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
		fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

		fireEvent.click(screen.getByRole('button', { name: /create account/i }));

		await waitFor(() => {
      // This error message comes from your component's validate() function
			expect(mockToastError).toHaveBeenCalledWith('Name is required');
		});

		expect(mockRegister).not.toHaveBeenCalled();
	});
  
	test('shows validation error for short password', async () => {
		const mockRegister = jest.fn();
		renderWithContext(mockRegister);

		fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Test User' } });
		fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
		fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123' } });

		fireEvent.click(screen.getByRole('button', { name: /create account/i }));

		await waitFor(() => {
      // This error message comes from your component's validate() function
			expect(mockToastError).toHaveBeenCalledWith('Password must be at least 6 characters long');
		});

		expect(mockRegister).not.toHaveBeenCalled();
	});

	test('shows validation error for invalid mobile number', async () => {
		const mockRegister = jest.fn();
		renderWithContext(mockRegister);
    
    // Fill all fields, but mobile is invalid
		fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Test User' } });
		fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
		fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Mobile Number (+911234567890)'), { target: { value: '12345' } });


		fireEvent.click(screen.getByRole('button', { name: /create account/i }));

		await waitFor(() => {
      // This error message comes from your component's validate() function
			expect(mockToastError).toHaveBeenCalledWith('Mobile number must be in format +911234567890 (+91 followed by 10 digits)');
		});

		expect(mockRegister).not.toHaveBeenCalled();
	});

	test('calls register function with correct data on successful validation', async () => {
		const mockRegister = jest.fn().mockResolvedValue(true);
		renderWithContext(mockRegister);

		const testData = {
			name: 'Test User',
			email: 'test@example.com',
			password: 'password123',
			mobileNumber: '+919876543210',
			role: 'coordinator',
		};

		fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: testData.name } });
		fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: testData.email } });
		fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: testData.password } });
		fireEvent.change(screen.getByPlaceholderText('Mobile Number (+911234567890)'), { target: { value: testData.mobileNumber } });
		fireEvent.change(screen.getByRole('combobox'), { target: { value: testData.role } });

		fireEvent.click(screen.getByRole('button', { name: /create account/i }));

		await waitFor(() => {
			expect(mockToastPromise).toHaveBeenCalled();
		});

		expect(mockRegister).toHaveBeenCalledWith(testData);
		expect(mockToastError).not.toHaveBeenCalled();
	});
});