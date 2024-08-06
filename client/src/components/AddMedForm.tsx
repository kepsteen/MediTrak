import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from './ui/textarea';
import { useToast } from './ui/use-toast';
import { useNavigate } from 'react-router';
import { useUser } from './useUser';
import { readToken } from '@/lib/data';

const formSchema = z
  .object({
    name: z.string().min(2).max(50),
    dosage: z.string().min(1).max(50),
    form: z.string(),
    notes: z.string().optional(),
    prescriber: z.string().optional(),
    amount: z.coerce.string(),
    remaining: z.coerce.string(),
  })
  .refine(
    (data) => {
      if (!data.amount || !data.remaining) {
        return false;
      }
      return true;
    },
    {
      message: 'Remaining and amount required',
      path: ['amount'],
    }
  )
  .refine(
    (data) => {
      if (data.amount && data.remaining) {
        return parseInt(data.remaining) <= parseInt(data.amount);
      }
      return true;
    },
    {
      message: 'Remaining must be less than amount',
      path: ['remaining'],
    }
  );

export function AddMedForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      dosage: '',
      form: 'Tablet',
      notes: '',
      prescriber: '',
      amount: '',
      remaining: '',
    },
  });
  const { toast } = useToast();
  const { user } = useUser();
  const navigate = useNavigate();
  const token = readToken();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newMedication = { ...values, scheduled: false, userId: user?.userId };
    for (const key in newMedication) {
      if (newMedication[key] === '') newMedication[key] = null;
    }
    const response = await fetch('/api/medications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newMedication),
    });
    if (!response.ok) throw new Error(`Response status: ${response.status}`);
    navigate('/medications');
    toast({
      title: `${newMedication.name} ${newMedication.dosage} ${newMedication.form} added`,
    });
    form.reset({
      name: '',
      dosage: '',
      form: 'Tablet',
      notes: '',
      prescriber: '',
      amount: '',
      remaining: '',
    });
  }
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-4 ">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Generic or Brand name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dosage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dosage</FormLabel>
                <FormControl>
                  <Input placeholder="10 mg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="form"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Form</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Tablet">Tablet</SelectItem>
                    <SelectItem value="Capsule">Capsule</SelectItem>
                    <SelectItem value="Liquid">Liquid</SelectItem>
                    <SelectItem value="Injection">Injection</SelectItem>
                    <SelectItem value="Patch">Patch</SelectItem>
                    <SelectItem value="Inhaler">Inhaler</SelectItem>
                    <SelectItem value="Topical">Topical</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="col-span-2 row-span-2">
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write any notes about the medication here"
                    className="resize-none"
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prescriber"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Prescriber</FormLabel>
                <FormControl>
                  <Input placeholder="Dr. Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doses</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="remaining"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remaining</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="col-span-2">
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}
