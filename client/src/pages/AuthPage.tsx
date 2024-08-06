import { SignInForm } from '@/components/SignInForm';
import { RegistrationForm } from '@/components/RegistrationForm';

type Props = {
  mode: 'sign-up' | 'sign-in';
};

export function AuthPage({ mode }: Props) {
  return (
    <>
      {mode === 'sign-in' && <SignInForm />}
      {mode === 'sign-up' && <RegistrationForm />}
    </>
  );
}
