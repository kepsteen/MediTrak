import { SignInForm } from '@/components/SignInForm';
import { RegistrationForm } from '@/components/RegistrationForm';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from '@/components/useUser';

type Props = {
  mode: 'sign-up' | 'sign-in';
};

export function AuthPage({ mode }: Props) {
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (user) navigate('/medications');
  }, [user, navigate]);
  return (
    <>
      {mode === 'sign-in' && <SignInForm />}
      {mode === 'sign-up' && <RegistrationForm />}
    </>
  );
}
