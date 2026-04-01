import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm.jsx";
import { useAuthStore } from "../store/authStore";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const authError = useAuthStore((state) => state.authError);

  const handleLogin = async (values) => {
    const result = await login(values);
    if (result.success) {
      navigate("/feed");
    }
  };

  return (
    <section className="auth-layout">
      <AuthForm
        fields={[
          {
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "you@example.com"
          },
          {
            name: "password",
            label: "Password",
            type: "password",
            placeholder: "Enter your password"
          }
        ]}
        footer={
          <p className="auth-footer">
            New here? <Link to="/signup">Create an account</Link>
          </p>
        }
        onSubmit={handleLogin}
        schema={loginSchema}
        submitLabel="Login"
        subtitle="Access your social feed and interact with posts."
        title="Welcome Back"
      />
      {authError && <div className="status-card error-card">{authError}</div>}
    </section>
  );
}

export default LoginPage;
