import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import RegisterForm from '../../components/auth/RegisterForm'
import { AuthProvider } from '../../contexts/AuthContext'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

// Mock AuthContext
const mockRegister = vi.fn()
const mockAuthContext = {
  register: mockRegister,
  isAuthenticated: false,
  token: null,
  user: null,
  login: vi.fn(),
  logout: vi.fn()
}

vi.mock('../../contexts/AuthContext', async () => {
  const actual = await vi.importActual('../../contexts/AuthContext')
  return {
    ...actual,
    useAuthContext: () => mockAuthContext
  }
})

function renderWithProviders(component: React.ReactElement) {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders registration form correctly', () => {
    renderWithProviders(<RegisterForm />)
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /role/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    renderWithProviders(<RegisterForm />)
    
    const submitButton = screen.getByRole('button', { name: /register/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    renderWithProviders(<RegisterForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    await user.type(emailInput, 'invalid-email')
    
    const submitButton = screen.getByRole('button', { name: /register/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument()
    })
  })

  it('validates password strength', async () => {
    const user = userEvent.setup()
    renderWithProviders(<RegisterForm />)
    
    const passwordInput = screen.getByLabelText(/^password/i)
    await user.type(passwordInput, 'weak')
    
    // Password strength indicator should show
    expect(screen.getByText(/weak/i)).toBeInTheDocument()
  })

  it('validates password confirmation match', async () => {
    const user = userEvent.setup()
    renderWithProviders(<RegisterForm />)
    
    const passwordInput = screen.getByLabelText(/^password/i)
    const confirmInput = screen.getByLabelText(/confirm password/i)
    
    await user.type(passwordInput, 'Password123!')
    await user.type(confirmInput, 'DifferentPassword123!')
    
    const submitButton = screen.getByRole('button', { name: /register/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    mockRegister.mockResolvedValue({})
    
    renderWithProviders(<RegisterForm />)
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/^password/i), 'Password123!')
    await user.type(screen.getByLabelText(/confirm password/i), 'Password123!')
    await user.selectOptions(screen.getByRole('combobox', { name: /role/i }), 'Developer')
    
    const termsCheckbox = screen.getByRole('checkbox', { name: /terms/i })
    await user.click(termsCheckbox)
    
    const submitButton = screen.getByRole('button', { name: /register/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        role: 'Developer'
      })
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('displays server error when registration fails', async () => {
    const user = userEvent.setup()
    mockRegister.mockRejectedValue({
      response: { data: { message: 'Email already exists' } }
    })
    
    renderWithProviders(<RegisterForm />)
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/^password/i), 'Password123!')
    await user.type(screen.getByLabelText(/confirm password/i), 'Password123!')
    
    const termsCheckbox = screen.getByRole('checkbox', { name: /terms/i })
    await user.click(termsCheckbox)
    
    const submitButton = screen.getByRole('button', { name: /register/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    mockRegister.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    renderWithProviders(<RegisterForm />)
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/^password/i), 'Password123!')
    await user.type(screen.getByLabelText(/confirm password/i), 'Password123!')
    
    const termsCheckbox = screen.getByRole('checkbox', { name: /terms/i })
    await user.click(termsCheckbox)
    
    const submitButton = screen.getByRole('button', { name: /register/i })
    await user.click(submitButton)
    
    expect(screen.getByText(/registering/i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })
})