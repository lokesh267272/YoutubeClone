import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";

function validate(fields) {
  // Check the main signup rules before sending anything to the server.
  const errors = {};
  if (!fields.username.trim()) {
    errors.username = "Username is required.";
  } else if (fields.username.trim().length < 3) {
    errors.username = "Username must be at least 3 characters.";
  } else if (fields.username.trim().length > 20) {
    errors.username = "Username must be 20 characters or fewer.";
  } else if (!/^[a-zA-Z0-9_]+$/.test(fields.username.trim())) {
    errors.username =
      "Username can only contain letters, numbers, and underscores.";
  }
  if (!fields.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!fields.password) {
    errors.password = "Password is required.";
  } else if (fields.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }
  return errors;
}

function InputField({
  id,
  label,
  type = "text",
  icon,
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

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
            ${icon ? "pl-10 pr-4" : "px-4"}
            ${isPassword ? "!pr-11" : ""}
            ${
              error
                ? "border-error focus:border-error focus:bg-error/5"
                : "border-surface-variant focus:border-[#FF0000] focus:bg-surface-container-lowest"
            }
          `}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <span className="material-symbols-outlined text-[20px]">
              {showPassword ? "visibility_off" : "visibility"}
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

export default function RegisterPage() {
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(field) {
    return (e) => {
      setFields((prev) => ({ ...prev, [field]: e.target.value }));
      // Drop stale errors once the user starts correcting a field.
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
      setGlobalError("");
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
    setGlobalError("");
    try {
      await api.post("/auth/register", {
        username: fields.username.trim(),
        email: fields.email.trim(),
        password: fields.password,
      });
      // Show a quick success state before sending the user to sign in.
      setSuccess(true);
      setTimeout(
        () =>
          navigate("/login", {
            state: { registeredEmail: fields.email.trim() },
          }),
        1500,
      );
    } catch (err) {
      // Push backend conflicts to the matching field when possible.
      const msg =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      if (msg.toLowerCase().includes("email")) setErrors({ email: msg });
      else if (msg.toLowerCase().includes("username"))
        setErrors({ username: msg });
      else setGlobalError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-4">
      <div className="w-full max-w-[420px]">
        {/* Card */}
        <div className="bg-surface-container-lowest border border-surface-variant rounded-2xl p-8 shadow-lg">
          {/* Logo + heading */}
          <div className="flex flex-col items-center mb-8">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
              className="mb-5"
            >
              <img
                src="/YouTube_Logo_2017.svg.png"
                alt="YouTube"
                className="h-8 w-auto"
              />
            </a>
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-secondary mt-1">
              Start watching and sharing videos
            </p>
          </div>

          {/* Success state */}
          {success ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="w-16 h-16 rounded-full bg-[#6bcb77]/15 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#6bcb77] text-[36px]">
                  check_circle
                </span>
              </div>
              <p className="text-base font-semibold text-on-surface">
                Account created!
              </p>
              <p className="text-sm text-secondary text-center">
                Redirecting you to sign in…
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-4"
            >
              {/* Global error */}
              {globalError && (
                <div className="flex items-start gap-2 px-4 py-3 bg-error/10 border border-error/30 rounded-xl text-sm text-error">
                  <span className="material-symbols-outlined text-[18px] mt-0.5 flex-shrink-0">
                    warning
                  </span>
                  <span>{globalError}</span>
                </div>
              )}

              <InputField
                id="username"
                label="Username"
                icon="person"
                value={fields.username}
                onChange={handleChange("username")}
                error={errors.username}
                placeholder="e.g. john_doe"
                autoComplete="username"
              />

              <InputField
                id="email"
                label="Email address"
                type="email"
                icon="mail"
                value={fields.email}
                onChange={handleChange("email")}
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
                onChange={handleChange("password")}
                error={errors.password}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
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
                    Creating account…
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </form>
          )}

          {!success && (
            <p className="text-center text-sm text-secondary mt-6 pt-5 border-t border-surface-variant">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#FF0000] font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
