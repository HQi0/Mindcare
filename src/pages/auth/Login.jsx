import AuthLayout from '../../layouts/AuthLayout.jsx';
import AuthCard from '../../components/auth/AuthCard.jsx';
import LoginForm from '../../components/auth/LoginForm.jsx';

export default function Login() {
  return (
    <AuthLayout>
      <AuthCard mode="login">
        <LoginForm />
      </AuthCard>
    </AuthLayout>
  );
}
