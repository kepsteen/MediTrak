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
import { createConnectionRequest, fetchConnectedUsers } from '@/lib/data';
import { useState } from 'react';
import { ConnectedUsers } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle } from 'lucide-react';
import { useToast } from './ui/use-toast';

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
  const [error, setError] = useState<unknown | string>();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      confirmUsername: '',
    },
  });
  const { toast } = useToast();

  /**
   * Updates the connectedUsers state when a new request is created
   */
  async function updateConnectedUsers() {
    try {
      const connectedUsers = await fetchConnectedUsers();
      setConnectedUsers(connectedUsers);
    } catch (error) {
      toast({ title: String(error) });
    }
  }

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      await createConnectionRequest(values.username);
      closeModal();
      updateConnectedUsers();
    } catch (error) {
      setError(String(error));
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
