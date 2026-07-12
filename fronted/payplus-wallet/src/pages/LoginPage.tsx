import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../contexts/AuthContext";
import { translateApiError } from "../utils/apiErrors";

const loginSchema = z.object({
  email: z.string().trim().email("אימייל לא תקין"),
  password: z.string().min(6, "סיסמה חייבת להכיל לפחות 6 תווים"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const from = (location.state as { from?: string } | null)?.from ?? "/dashboard";

  if (!loading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  async function onSubmit(data: LoginFormValues) {
    try {
      setSubmitting(true);
      setError("");
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(translateApiError(err, "הכניסה נכשלה"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="eb-card auth-card">
          <h1>כניסה</h1>
          <p className="subtitle">ברוך שובך ל-PayPlus ארנק</p>
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Form.Group className="mb-3">
              <Form.Label>אימייל</Form.Label>
              <Form.Control type="email" {...register("email")} isInvalid={!!errors.email} />
              <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>סיסמה</Form.Label>
              <Form.Control type="password" {...register("password")} isInvalid={!!errors.password} />
              <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button type="submit" className="btn-eb-primary w-100" disabled={submitting}>
              {submitting ? "נכנס..." : "כניסה"}
            </Button>
          </Form>
          <p className="mt-3 mb-0 text-center">
            אין לך חשבון? <Link to="/register">הרשמה</Link>
          </p>
        </div>
      </div>
  );
}

export default LoginPage;
