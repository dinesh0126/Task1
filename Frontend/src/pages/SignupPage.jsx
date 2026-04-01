import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm.jsx";
import { useAuthStore } from "../store/authStore";

const signupSchema = z.object({
  name: z.string().min(2, "Name should be at least 2 characters").max(50),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password should be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
      "Use uppercase, lowercase, number and special character"
    ),
  profileImage: z
    .any()
    .optional()
    .refine((files) => !files?.length || files[0]?.size <= 2 * 1024 * 1024, {
      message: "Profile image should be under 2MB"
    })
    .refine(
      (files) =>
        !files?.length ||
        ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(files[0]?.type),
      {
        message: "Use JPG, PNG, or WEBP image"
      }
    )
});

function SignupPage() {
  const navigate = useNavigate();
  const signup = useAuthStore((state) => state.signup);
  const authError = useAuthStore((state) => state.authError);

  const handleSignup = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);

    if (values.profileImage?.[0]) {
      formData.append("profileImage", values.profileImage[0]);
    }

    const result = await signup(formData);
    if (result.success) {
      navigate("/feed");
    }
  };

  return (
    <section className="auth-layout">
      <AuthForm
        fields={[
          {
            name: "name",
            label: "Full Name",
            type: "text",
            placeholder: "Dinesh Kumar"
          },
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
            placeholder: "Create a secure password"
          },
          {
            name: "profileImage",
            label: "Profile Image",
            type: "file",
            accept: "image/png,image/jpeg,image/jpg,image/webp"
          }
        ]}
        footer={
          <p className="auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        }
        onSubmit={handleSignup}
        schema={signupSchema}
        submitLabel="Create Account"
        subtitle="Sign up to create posts, like updates, and comment in the feed."
        title="Create Your Account"
      />
      {authError && <div className="status-card error-card">{authError}</div>}
    </section>
  );
}

export default SignupPage;
