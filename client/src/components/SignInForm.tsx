import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, useUser } from './useUser';
import { useToast } from './ui/use-toast';

type AuthData = {
  user: User;
  token: string;
};

export function SignInForm() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<unknown>();
  const { handleSignIn } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const checkUser = { username, password };
      const response = await fetch('/api/sign-in', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(checkUser),
      });
      if (!response.ok) throw new Error(`Response status: ${response.status}`);
      const { user, token } = (await response.json()) as AuthData;
      handleSignIn(user, token);
      toast({ title: `User ${username} successfully logged in.` });
      navigate('/');
    } catch (error) {
      setError(error);
    }
  }

  if (error) {
    return <p>{`Error signing in: ${error}`}</p>;
  }

  return (
    <>
      <section className="container h-screen flex items-center pt-[110px]">
        <Card className="w-full max-w-sm mx-auto">
          <form onSubmit={(e) => handleSubmit(e)}>
            <CardHeader>
              <CardTitle className="text-2xl text-redblack">Login</CardTitle>
              <CardDescription>
                Enter your username and password below to login to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="username"
                  required
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full bg-redblack">Sign in</Button>
              <div>
                Don't have an account yet?{' '}
                <Link to="/sign-up" className="font-bold">
                  Sign Up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </section>
    </>
  );
}
