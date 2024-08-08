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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import React, { useState } from 'react';
import { useToast } from './ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle, CalendarDaysIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Switch } from './ui/switch';

const regexSpecialCharacter = new RegExp(
  '[`!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>/?~\\s]'
);
const formSchema = z
  .object({
    username: z.string().min(2, {
      message: 'Username must be at least 2 characters.',
    }),
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters.',
    }),
    confirmPassword: z.string(),
    role: z.string(),
    dob: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Invalid date format'),
    phoneNumber: z.string().max(10),
    notificationsEnabled: z.boolean(),
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
  )
  .superRefine(({ password }, checkPassComplexity) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string) => regexSpecialCharacter.test(ch);
    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0;

    for (let i = 0; i < password.length; i++) {
      const ch = password.charAt(i);
      if (!isNaN(+ch)) countOfNumbers++;
      else if (containsUppercase(ch)) countOfUpperCase++;
      else if (containsLowercase(ch)) countOfLowerCase++;
      else if (containsSpecialChar(ch)) countOfSpecialChar++;
    }

    if (
      countOfLowerCase < 1 ||
      countOfUpperCase < 1 ||
      countOfSpecialChar < 1 ||
      countOfNumbers < 1
    ) {
      checkPassComplexity.addIssue({
        code: 'custom',
        path: ['password'],
        message: 'Password does not meet complexity requirements.',
      });
    }
  });

export function RegistrationForm() {
  const [error, setError] = useState<string>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      dob: '',
      role: '',
      phoneNumber: '',
      notificationsEnabled: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('clicked');
    try {
      const newUser = { ...values };
      const response = await fetch('/api/sign-up', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) {
        if (response.status === 409) {
          setError(`Username ${values.username} is already taken.`);
          return;
        }
        throw new Error(`Response status: ${response.status}`);
      }
      toast({ title: `Successfully created account ${values.username}` });
      navigate('/sign-in');
    } catch (error) {
      setError(String(error));
    }

    console.log('values', values);
  }

  return (
    <>
      <section className="container flex items-center pt-[110px] pb-[40px]">
        <Card className="max-w-sm mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-redblack">Register</CardTitle>
            <CardDescription>
              Enter your information to create an account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
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
                      <FormDescription>
                        Password must be at least 8 characters and contain an
                        uppercase letter, lowercase letter, a number and a
                        special character.
                      </FormDescription>
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
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="01/01/1991"
                            {...field}
                            onInput={(e: React.FormEvent<HTMLInputElement>) => {
                              const input = e.target as HTMLInputElement;
                              let value = input.value.replace(/\D/g, '');
                              if (value.length > 2) {
                                value = `${value.slice(0, 2)}/${value.slice(
                                  2
                                )}`;
                              }
                              if (value.length > 5) {
                                value = `${value.slice(0, 5)}/${value.slice(
                                  5
                                )}`;
                              }
                              input.value = value;
                            }}
                          />
                          <CalendarDaysIcon className="absolute w-5 h-5 -translate-y-1/2 right-3 top-1/2 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Patient">Patient</SelectItem>
                          <SelectItem value="Caregiver">Caregiver</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notificationsEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Text Notifications
                        </FormLabel>
                        <FormDescription>
                          Receive texts when medications are running low.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <Button type="submit" className="w-full bg-redblack">
                    Sign Up
                  </Button>
                  <span>Already have an account? </span>
                  <Link to="/sign-in" className="font-bold text-ruby">
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
