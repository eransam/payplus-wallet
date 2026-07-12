import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../contexts/AuthContext";
import { translateApiError } from "../utils/apiErrors";

const registerSchema = z.object({
  full_name: z.string().trim().min(2, "יש להזין שם מלא"),
  email: z.string().trim().email("אימייל לא תקין"),
  password: z.string().min(6, "סיסמה חייבת להכיל לפחות 6 תווים"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function RegisterPage() {
  const { register: registerUser, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { full_name: "", email: "", password: "" },
  });

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function onSubmit(data: RegisterFormValues) {
    try {
      setSubmitting(true);
      setError("");
      await registerUser(data.email, data.password, data.full_name);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(translateApiError(err, "ההרשמה נכשלה"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="eb-card auth-card">
          <h1>הרשמה</h1>
          <p className="subtitle">צור חשבון חדש ב-PayPlus ארנק</p>
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Form.Group className="mb-3">
              <Form.Label>שם מלא</Form.Label>
              <Form.Control type="text" {...register("full_name")} isInvalid={!!errors.full_name} />
              <Form.Control.Feedback type="invalid">{errors.full_name?.message}</Form.Control.Feedback>
            </Form.Group>
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
              {submitting ? "נרשם..." : "הרשמה"}
            </Button>
          </Form>
          <p className="mt-3 mb-0 text-center">
            כבר יש לך חשבון? <Link to="/login">כניסה</Link>
          </p>
        </div>
      </div>
  );
}

export default RegisterPage;
