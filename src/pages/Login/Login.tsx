import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

type FormValues = { userId: string; password: string };

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await loginUser(data);
      const token = res?.data?.data?.token;
      if (token) { login(token); navigate("/"); }
    } catch {
      setError("password", { message: "Invalid credentials. Please try again." });
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <svg viewBox="0 0 480 480" xmlns="http://www.w3.org/2000/svg" className="login-illustration">
          {/* desk */}
          <rect x="80" y="320" width="320" height="12" rx="6" fill="#b0bec5"/>
          <rect x="100" y="332" width="12" height="80" rx="4" fill="#90a4ae"/>
          <rect x="368" y="332" width="12" height="80" rx="4" fill="#90a4ae"/>
          {/* laptop base */}
          <rect x="140" y="260" width="200" height="60" rx="8" fill="#cfd8dc"/>
          <rect x="148" y="268" width="184" height="44" rx="4" fill="#eceff1"/>
          {/* laptop screen */}
          <rect x="150" y="160" width="180" height="110" rx="8" fill="#3d5af1"/>
          <rect x="158" y="168" width="164" height="94" rx="4" fill="#eef2ff"/>
          {/* screen content lines */}
          <rect x="168" y="180" width="80" height="8" rx="4" fill="#3d5af1" opacity="0.5"/>
          <rect x="168" y="196" width="120" height="6" rx="3" fill="#3d5af1" opacity="0.3"/>
          <rect x="168" y="210" width="100" height="6" rx="3" fill="#3d5af1" opacity="0.3"/>
          <rect x="168" y="224" width="60" height="6" rx="3" fill="#3d5af1" opacity="0.2"/>
          {/* character body */}
          <ellipse cx="310" cy="270" rx="28" ry="36" fill="#ffcc80"/>
          {/* character head */}
          <circle cx="310" cy="220" r="28" fill="#ffcc80"/>
          {/* eyes */}
          <circle cx="302" cy="216" r="3" fill="#333"/>
          <circle cx="318" cy="216" r="3" fill="#333"/>
          <circle cx="303" cy="215" r="1" fill="#fff"/>
          <circle cx="319" cy="215" r="1" fill="#fff"/>
          {/* smile */}
          <path d="M304 228 Q310 234 316 228" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round"/>
          {/* arms */}
          <path d="M282 270 Q260 290 250 310" stroke="#ffcc80" strokeWidth="14" strokeLinecap="round" fill="none"/>
          <path d="M338 270 Q360 290 250 310" stroke="#ffcc80" strokeWidth="14" strokeLinecap="round" fill="none"/>
          {/* decorative + signs */}
          <text x="100" y="200" fontSize="24" fill="#3d5af1" opacity="0.4" fontWeight="300">+</text>
          <text x="380" y="280" fontSize="20" fill="#3d5af1" opacity="0.3" fontWeight="300">+</text>
          <circle cx="120" cy="310" r="6" stroke="#3d5af1" strokeWidth="2" fill="none" opacity="0.4"/>
          <circle cx="390" cy="180" r="5" stroke="#3d5af1" strokeWidth="2" fill="none" opacity="0.3"/>
        </svg>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-brand">
            <svg width="140" height="36" viewBox="0 0 140 36" fill="none">
              <text x="0" y="27" fontFamily="Arial Black, Arial" fontSize="24" fontWeight="900" fill="#3d5af1">Prep</text>
              <text x="58" y="27" fontFamily="Arial Black, Arial" fontSize="24" fontWeight="900" fill="#1a1a2e">route</text>
              <path d="M52 8 Q56 4 60 8 Q56 12 52 8Z" fill="#3d5af1" opacity="0.5"/>
            </svg>
          </div>

          <h1 className="login-title">Login</h1>
          <p className="login-sub">Use your company provided Login credentials</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="login-field">
              <label>User ID</label>
              <input
                placeholder="Enter User ID"
                className={errors.userId ? "err" : ""}
                {...register("userId", { required: "User ID is required" })}
              />
              {errors.userId && <span className="err-msg">{errors.userId.message}</span>}
            </div>

            <div className="login-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                className={errors.password ? "err" : ""}
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && <span className="err-msg">{errors.password.message}</span>}
            </div>

            <div className="forgot-row">
              <span className="forgot-link">Forgot password?</span>
            </div>

            <button type="submit" className="login-btn" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;