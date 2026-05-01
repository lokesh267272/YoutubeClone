import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AVATAR_COLORS = ['#4d96ff', '#ffd93d', '#6bcb77', '#c77dff', '#ff6b6b', '#ff9a3c', '#00b4d8', '#f72585'];

function validate(fields) {
  const errors = {};

  if (!fields.username.trim()) {
    errors.username = 'Username is required.';
  } else if (fields.username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters.';
  } else if (fields.username.trim().length > 20) {
    errors.username = 'Username must be 20 characters or fewer.';
  } else if (!/^[a-zA-Z0-9_]+$/.test(fields.username.trim())) {
    errors.username = 'Username can only contain letters, numbers, and underscores.';
  }

  if (!fields.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!fields.password) {
    errors.password = 'Password is required.';
  } else if (fields.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  if (!fields.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (fields.password !== fields.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
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

export default function RegisterPage() {
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(field) {
    return (e) => {
      setFields(prev => ({ ...prev, [field]: e.target.value }));
      // Clear individual field error on change
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
      // Check if email already registered (mock check against localStorage)
      const existingUsers = JSON.parse(localStorage.getItem('yt_mock_users') || '[]');
      const emailTaken = existingUsers.some(u => u.email.toLowerCase() === fields.email.trim().toLowerCase());

      if (emailTaken) {
        setErrors({ email: 'An account with this email already exists.' });
        setLoading(false);
        return;
      }

      // Simulate network delay
      await new Promise(r => setTimeout(r, 800));

      // Save mock user to localStorage
      const newUser = {
        _id: `user_${Date.now()}`,
        username: fields.username.trim(),
        email: fields.email.trim().toLowerCase(),
        password: fields.password,               // plain for mock only
        avatarBg: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
        channelId: null,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('yt_mock_users', JSON.stringify([...existingUsers, newUser]));

      setSuccess(true);

      // Redirect to login after 1.5s so user sees the success state
      setTimeout(() => navigate('/login', { state: { registeredEmail: fields.email.trim() } }), 1500);
    } catch {
      setGlobalError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-headline-md font-headline-md text-on-surface">Create your account</h1>
            <p className="text-body-md text-secondary mt-1">Start watching and sharing videos</p>
          </div>

          {/* Success state */}
          {success ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-14 h-14 rounded-full bg-[#6bcb77]/15 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#6bcb77] text-[32px]">check_circle</span>
              </div>
              <p className="text-title-sm font-title-sm text-on-surface">Account created!</p>
              <p className="text-body-md text-secondary text-center">Redirecting you to sign in…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

              {/* Global error */}
              {globalError && (
                <div className="flex items-center gap-2 px-4 py-3 bg-error-container rounded-lg text-body-md text-on-error-container">
                  <span className="material-symbols-outlined text-[18px]">warning</span>
                  {globalError}
                </div>
              )}

              <InputField
                id="username"
                label="Username"
                value={fields.username}
                onChange={handleChange('username')}
                error={errors.username}
                placeholder="e.g. john_doe"
                autoComplete="username"
              />

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

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  id="password"
                  label="Password"
                  type="password"
                  value={fields.password}
                  onChange={handleChange('password')}
                  error={errors.password}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                />
                <InputField
                  id="confirmPassword"
                  label="Confirm password"
                  type="password"
                  value={fields.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  error={errors.confirmPassword}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                />
              </div>

              {/* Password strength hint */}
              {fields.password && (
                <PasswordStrength password={fields.password} />
              )}

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
                    Creating account…
                  </>
                ) : (
                  'Create account'
                )}
              </button>
            </form>
          )}

          {/* Footer link */}
          {!success && (
            <p className="text-center text-body-md text-secondary mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          )}
        </div>

        {/* Legal note */}
        <p className="text-center text-body-sm text-secondary mt-4 px-4">
          By creating an account you agree to our{' '}
          <span className="text-primary cursor-pointer hover:underline">Terms of Service</span>
          {' '}and{' '}
          <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}

function PasswordStrength({ password }) {
  const checks = [
    { label: 'At least 6 characters', pass: password.length >= 6 },
    { label: 'Contains a number', pass: /\d/.test(password) },
    { label: 'Contains uppercase letter', pass: /[A-Z]/.test(password) },
  ];
  const passed = checks.filter(c => c.pass).length;
  const strengthColor = passed === 0 ? '#e4e2e2' : passed === 1 ? '#ff6b6b' : passed === 2 ? '#ffd93d' : '#6bcb77';
  const strengthLabel = ['', 'Weak', 'Fair', 'Strong'][passed];

  return (
    <div className="flex flex-col gap-2">
      {/* Progress bar */}
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: i < passed ? strengthColor : '#e4e2e2' }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {checks.map(c => (
            <span key={c.label} className={`text-body-sm flex items-center gap-0.5 ${c.pass ? 'text-[#6bcb77]' : 'text-secondary'}`}>
              <span className="material-symbols-outlined text-[12px]">{c.pass ? 'check' : 'remove'}</span>
              {c.label}
            </span>
          ))}
        </div>
        {strengthLabel && (
          <span className="text-label-md font-label-md" style={{ color: strengthColor }}>{strengthLabel}</span>
        )}
      </div>
    </div>
  );
}
