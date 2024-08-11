import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
// import { useUser } from './useUser';
import { readToken } from '@/lib/data';
import { useState } from 'react';
import { ConnectedUsers } from 'data';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle } from 'lucide-react';

const FormSchema = z
  .object({
    username: z.string().min(2, {
      message: 'Username must be at least 2 characters.',
    }),
    confirmUsername: z.string(),
  })
  .refine(
    (data) => {
      if (data.confirmUsername !== data.username) {
        return false;
      }
      return true;
    },
    {
      message: 'Usernames must match',
      path: ['confirmUsername'],
    }
  );

type Props = {
  closeModal: () => void;
  setConnectedUsers: (value: ConnectedUsers[]) => void;
};

export function AddCaregiverForm({ closeModal, setConnectedUsers }: Props) {
  // const { user } = useUser();
  const token = readToken();
  const [error, setError] = useState<unknown | string>();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      confirmUsername: '',
    },
  });
  async function fetchConnectedUsers() {
    try {
      const response = await fetch('/api/requests', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`Response status: ${response.status}`);
      const requestsResult = (await response.json()) as ConnectedUsers[];
      setConnectedUsers(requestsResult);
    } catch (error) {
      setError(error);
    }
  }

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      const response = await fetch('/api/requests/add', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: values.username }),
      });
      if (!response.ok) {
        if (response.status === 404) {
          setError(`Username ${values.username} does not exist.`);
          return;
        } else {
          throw new Error(`Response status: ${response.status}`);
        }
      }
      closeModal();
      fetchConnectedUsers();
    } catch (error) {
      setError(error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 text-left">
        {typeof error === 'string' && (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmUsername"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Confirm Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="secondary" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}