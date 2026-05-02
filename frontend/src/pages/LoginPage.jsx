import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';

function validate(fields) {
  // Keep the login checks small and focused on required fields.
  const errors = {};
  if (!fields.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (!fields.password) {
    errors.password = 'Password is required.';
  }
  return errors;
}

function InputField({ id, label, type = 'text', icon, value, onChange, error, placeholder, autoComplete }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-on-surface">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-secondary pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`
            w-full h-12 rounded-xl text-sm text-on-surface bg-surface-container
            border-2 transition-all duration-150 outline-none
            placeholder:text-secondary/60
            ${icon ? 'pl-10 pr-4' : 'px-4'}
            ${isPassword ? '!pr-11' : ''}
            ${error
              ? 'border-error focus:border-error focus:bg-error/5'
              : 'border-surface-variant focus:border-[#FF0000] focus:bg-surface-container-lowest'
            }
          `}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(p => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-error flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px]">error</span>
          {error}
        </p>
      )}
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();

  const [fields, setFields] = useState({
    email: location.state?.registeredEmail || '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);
  const [justRegistered] = useState(!!location.state?.registeredEmail);

  useEffect(() => {
    // Skip the login page when the user already has a session.
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  function handleChange(field) {
    return (e) => {
      setFields(prev => ({ ...prev, [field]: e.target.value }));
      // Clear field-level errors as the user fixes them.
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
      setGlobalError('');
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(fields);
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

    // Only hit the API after the form passes local validation.
    setLoading(true);
    setGlobalError('');
    try {
      const { data } = await api.post('/auth/login', {
        email: fields.email.trim(),
        password: fields.password,
      });
      login(data.token, data.user);
      navigate('/', { replace: true });
    } catch (err) {
      setGlobalError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function fillDemo() {
    // Prefill the public demo account for quick testing.
    setFields({ email: 'test@example.com', password: 'password123' });
    setErrors({});
    setGlobalError('');
  }

  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">

        {/* Card */}
        <div className="bg-surface-container-lowest border border-surface-variant rounded-2xl p-8 shadow-lg">

          {/* Logo + heading */}
          <div className="flex flex-col items-center mb-8">
            <a href="/" onClick={e => { e.preventDefault(); navigate('/'); }} className="mb-5">
              <img src="/YouTube_Logo_2017.svg.png" alt="YouTube" className="h-8 w-auto" />
            </a>
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">Sign in</h1>
            <p className="text-sm text-secondary mt-1">Welcome back! Enter your details below.</p>
          </div>

          {/* Success banner */}
          {justRegistered && (
            <div className="flex items-center gap-2 px-4 py-3 bg-[#6bcb77]/10 border border-[#6bcb77]/30 rounded-xl text-sm text-on-surface mb-5">
              <span className="material-symbols-outlined text-[#6bcb77] text-[18px]">check_circle</span>
              Account created! Sign in below.
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

            {/* Global error */}
            {globalError && (
              <div className="flex items-start gap-2 px-4 py-3 bg-error/10 border border-error/30 rounded-xl text-sm text-error">
                <span className="material-symbols-outlined text-[18px] mt-0.5 flex-shrink-0">warning</span>
                <span>{globalError}</span>
              </div>
            )}

            <InputField
              id="email"
              label="Email address"
              type="email"
              icon="mail"
              value={fields.email}
              onChange={handleChange('email')}
              error={errors.email}
              placeholder="you@example.com"
              autoComplete="email"
            />

            <InputField
              id="password"
              label="Password"
              type="password"
              icon="lock"
              value={fields.password}
              onChange={handleChange('password')}
              error={errors.password}
              placeholder="Your password"
              autoComplete="current-password"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-1 rounded-xl bg-[#FF0000] hover:bg-[#cc0000] text-white text-sm font-bold tracking-wide transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <hr className="flex-1 border-surface-variant" />
            <span className="text-xs text-secondary font-medium">OR</span>
            <hr className="flex-1 border-surface-variant" />
          </div>

          {/* Demo account */}
          <button
            onClick={fillDemo}
            className="w-full h-12 rounded-xl border-2 border-surface-variant bg-surface-container-lowest text-sm text-on-surface font-semibold hover:bg-surface-container hover:border-on-surface/20 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">bolt</span>
            Use demo account
          </button>

          <p className="text-center text-xs text-secondary mt-2.5">
            <span className="font-semibold text-on-surface">test@example.com</span>
            {' · '}
            <span className="font-semibold text-on-surface">password123</span>
          </p>

          {/* Sign up link */}
          <p className="text-center text-sm text-secondary mt-6 pt-5 border-t border-surface-variant">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-[#FF0000] font-semibold hover:underline">
              Create account
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-secondary mt-4">
          © 2026 YouTube Clone · Built with MERN Stack
        </p>
      </div>
    </div>
  );
}
