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
import {
  addMedication,
  checkInteractions,
  fetchMedications,
  Interaction,
  medNames,
} from '@/lib/data';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { useState } from 'react';
import { cn } from '@/lib/utils';

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

type Props = {
  patientId: number;
};

export function AddMedForm({ patientId }: Props) {
  const [hasInteractions, setHasInteractions] = useState(false);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [isPending, setIsPending] = useState(false);

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
  const navigate = useNavigate();

  // Random med placeholder for ease of use
  const randomIndex = Math.floor(Math.random() * 100);
  const randomMed = medNames[randomIndex];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true);
    try {
      const newMedication = { ...values, scheduled: false, userId: patientId };
      for (const key in newMedication) {
        if (newMedication[key] === '') newMedication[key] = null;
      }
      await addMedication(newMedication);
      toast({
        title: `${newMedication.name} ${newMedication.dosage} ${newMedication.form} added`,
      });

      const medications = await fetchMedications(patientId.toString());
      const interactionResponse = await checkInteractions(medications);
      setInteractions(interactionResponse.interactions);
      if (interactionResponse.hasInteractions) {
        setHasInteractions(true);
      } else {
        navigate('/medications');
      }
    } catch (error) {
      toast({ title: String(error), variant: 'destructive' });
    } finally {
      setIsPending(false);
    }
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
                  <Input placeholder={randomMed} {...field} />
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
            {isPending ? 'Checking Interactions...' : 'Submit'}
          </Button>
        </form>
      </Form>
      <Dialog
        open={hasInteractions}
        onOpenChange={() => {
          setHasInteractions(false);
          navigate('/medications');
        }}>
        <DialogContent className="max-h-[60vh] overflow-scroll">
          <DialogHeader>
            <DialogTitle>
              <span className="text-red-500">WARNING:</span> Medication
              Interactions Found
            </DialogTitle>
            <DialogDescription>
              Some of your medications may interact with each other. Please
              consult your doctor before taking any of these medications.
            </DialogDescription>
          </DialogHeader>
          <section>
            {interactions.map((interaction, index) => (
              <div
                className={cn(
                  `p-4 my-4 border-2 rounded-md`,
                  interaction.severity === 'Severe' && 'border-red-500',
                  interaction.severity === 'Moderate' && 'border-yellow-500',
                  interaction.severity === 'Mild' && 'border-gray-500'
                )}
                key={interaction.medications.join(',') + index}>
                <p>
                  <span className="font-bold">Medications: </span>
                  {interaction.medications.join(' + ')}
                </p>
                <p
                  className={cn(
                    interaction.severity === 'Severe' && 'text-red-500',
                    interaction.severity === 'Moderate' && 'text-yellow-500'
                  )}>
                  <span className="font-bold text-black">Severity: </span>
                  {interaction.severity}
                </p>
                <p>
                  <span className="font-bold">Effect: </span>
                  {interaction.effect}
                </p>
              </div>
            ))}
          </section>
        </DialogContent>
      </Dialog>
    </>
  );
}
