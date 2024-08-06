import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useState } from 'react';
import { useToast } from './ui/use-toast';

const formSchema = z
  .object({
    username: z.string().min(2, {
      message: 'Username must be at least 2 characters.',
    }),
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters.',
    }),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      if (data.confirmPassword !== data.password) {
        return false;
      }
      return true;
    },
    {
      message: 'Passwords must match',
      path: ['confirmPassword'],
    }
  );

export function RegistrationForm() {
  const [error, setError] = useState<unknown>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const newUser = { ...values, role: 'Patient' };
      const response = await fetch('/api/sign-up', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error(`Response status: ${response.status}`);
      toast({ title: `Successfully created account ${values.username}` });
      navigate('/sign-in');
    } catch (error) {
      setError(error);
    }
  }

  if (error) {
    return <p>{`Error: ${error}`}</p>;
  }

  return (
    <>
      <section className="container h-screen flex items-center pt-[110px]">
        <Card className="max-w-sm mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-redblack">Login</CardTitle>
            <CardDescription>
              Enter your information to create an account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <Button className="w-full bg-redblack">Sign Up</Button>
                  <span>Already have an account? </span>
                  <Link to="/sign-in" className="font-bold">
                    Sign In
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
