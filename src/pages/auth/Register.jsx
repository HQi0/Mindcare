import AuthLayout from '../../layouts/AuthLayout.jsx';
import AuthCard from '../../components/auth/AuthCard.jsx';
import RegisterForm from '../../components/auth/RegisterForm.jsx';

export default function Register() {
  return (
    <AuthLayout>
      <AuthCard mode="register">
        <RegisterForm />
      </AuthCard>
    </AuthLayout>
  );
}
