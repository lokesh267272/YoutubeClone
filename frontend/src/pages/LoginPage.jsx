import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Pre-seeded demo account so evaluators can log in without registering
const DEMO_USER = {
  _id: 'user_demo',
  username: 'JohnDoe',
  email: 'test@example.com',
  password: 'password123',
  avatarBg: '#4d96ff',
  channelId: 'ch01',
};

function validate(fields) {
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

function InputField({ id, label, type = 'text', value, onChange, error, placeholder, autoComplete }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-body-md font-medium text-on-surface">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`
            w-full h-11 px-4 rounded-lg text-body-md text-on-surface bg-surface-container
            border transition-all duration-150 outline-none
            placeholder:text-secondary
            ${error
              ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
              : 'border-surface-variant focus:border-secondary focus:ring-2 focus:ring-secondary/10'
            }
            ${isPassword ? 'pr-11' : ''}
          `}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(p => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface transition-colors"
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
        <p className="text-body-sm text-error flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">error</span>
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

  // Already logged in — bounce to home
  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  function handleChange(field) {
    return (e) => {
      setFields(prev => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
      setGlobalError('');
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(fields);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setGlobalError('');

    try {
      await new Promise(r => setTimeout(r, 700));

      const emailLower = fields.email.trim().toLowerCase();

      // 1. Check demo account
      let matchedUser = null;
      if (emailLower === DEMO_USER.email && fields.password === DEMO_USER.password) {
        matchedUser = DEMO_USER;
      }

      // 2. Check localStorage registered users
      if (!matchedUser) {
        const storedUsers = JSON.parse(localStorage.getItem('yt_mock_users') || '[]');
        const found = storedUsers.find(
          u => u.email.toLowerCase() === emailLower && u.password === fields.password,
        );
        if (found) matchedUser = found;
      }

      if (!matchedUser) {
        setGlobalError('Incorrect email or password. Try test@example.com / password123.');
        setLoading(false);
        return;
      }

      // Issue a mock JWT-shaped token
      const mockToken = btoa(JSON.stringify({
        userId: matchedUser._id,
        username: matchedUser.username,
        email: matchedUser.email,
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
      }));

      login(mockToken, {
        _id: matchedUser._id,
        username: matchedUser.username,
        email: matchedUser.email,
        avatarBg: matchedUser.avatarBg,
        channelId: matchedUser.channelId || null,
      });

      navigate('/', { replace: true });
    } catch {
      setGlobalError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function fillDemo() {
    setFields({ email: 'test@example.com', password: 'password123' });
    setErrors({});
    setGlobalError('');
  }

  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-gutter">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-8 md:p-10 shadow-sm">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <a href="/" className="flex items-center gap-1.5 mb-6">
              <span
                className="material-symbols-outlined text-primary text-[36px]"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                play_circle
              </span>
              <span className="text-display-lg font-display-lg text-on-surface tracking-tight">
                YouTube
              </span>
            </a>
            <h1 className="text-headline-md font-headline-md text-on-surface">Sign in</h1>
            <p className="text-body-md text-secondary mt-1">to continue to YouTube</p>
          </div>

          {/* "Just registered" success banner */}
          {justRegistered && (
            <div className="flex items-center gap-2 px-4 py-3 bg-surface-container rounded-lg text-body-md text-on-surface mb-5 border border-surface-variant">
              <span className="material-symbols-outlined text-[#6bcb77] text-[18px]">check_circle</span>
              Account created! Sign in below.
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

            {/* Global error */}
            {globalError && (
              <div className="flex items-start gap-2 px-4 py-3 bg-error-container rounded-lg text-body-md text-on-error-container">
                <span className="material-symbols-outlined text-[18px] mt-0.5 flex-shrink-0">warning</span>
                <span>{globalError}</span>
              </div>
            )}

            <InputField
              id="email"
              label="Email address"
              type="email"
              value={fields.email}
              onChange={handleChange('email')}
              error={errors.email}
              placeholder="you@example.com"
              autoComplete="email"
            />

            <div className="flex flex-col gap-1">
              <InputField
                id="password"
                label="Password"
                type="password"
                value={fields.password}
                onChange={handleChange('password')}
                error={errors.password}
                placeholder="Your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="self-end text-body-sm text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full h-11 mt-1 rounded-full bg-on-surface text-surface-container-lowest
                text-body-md font-semibold tracking-wide
                hover:opacity-90 active:scale-[0.98] transition-all duration-150
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
              "
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-surface-container-lowest/40 border-t-surface-container-lowest rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <hr className="flex-1 border-surface-variant" />
            <span className="text-body-sm text-secondary">or</span>
            <hr className="flex-1 border-surface-variant" />
          </div>

          {/* Demo credentials shortcut */}
          <button
            onClick={fillDemo}
            className="
              w-full h-11 rounded-full border border-surface-variant bg-surface-container-lowest
              text-body-md text-on-surface font-medium
              hover:bg-surface-container transition-colors
              flex items-center justify-center gap-2
            "
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">
              bolt
            </span>
            Use demo account
          </button>

          {/* Hint below demo button */}
          <p className="text-center text-body-sm text-secondary mt-3">
            <span className="font-medium text-on-surface">test@example.com</span>
            {' '}·{' '}
            <span className="font-medium text-on-surface">password123</span>
          </p>

          {/* Sign up link */}
          <p className="text-center text-body-md text-secondary mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Create account
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-body-sm text-secondary mt-4">
          © 2026 YouTube Clone · Built with MERN Stack
        </p>
      </div>
    </div>
  );
}
