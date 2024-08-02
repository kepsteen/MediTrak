import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from './ui/checkbox';
import { useState } from 'react';
import { Medication } from 'data';

const days = [
  {
    id: 'Monday',
    label: 'Monday',
  },
  {
    id: 'Tuesday',
    label: 'Tuesday',
  },
  {
    id: 'Wednesday',
    label: 'Wednesday',
  },
  {
    id: 'Thursday',
    label: 'Thursday',
  },
  {
    id: 'Friday',
    label: 'Friday',
  },
  {
    id: 'Saturday',
    label: 'Saturday',
  },
  {
    id: 'Sunday',
    label: 'Sunday',
  },
];

type Props = {
  medications: Medication[];
};

const formSchema = z.object({
  days: z.array(z.string()),
  frequency: z.string(),
});

export function AddScheduleForm({ medications }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      days: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      frequency: '0',
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    setSelectedIndex(selectedIndex + 1);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    form.reset();
  }
  return (
    <>
      <section className="container pt-4">
        <Card className="pt-4">
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8">
                <FormField
                  control={form.control}
                  name="days"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-2xl">
                          {medications[selectedIndex].name}
                        </FormLabel>
                        <FormDescription>
                          {`Select the days that you take ${medications[selectedIndex].name}`}
                        </FormDescription>
                      </div>
                      {days.map((day) => (
                        <FormField
                          key={day.id}
                          control={form.control}
                          name="days"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={day.id}
                                className="flex flex-row items-center space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(day.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            day.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== day.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-lg font-normal">
                                  {day.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How many doses per day?</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent position="popper">
                          <SelectItem value="0">PRN</SelectItem>
                          <SelectItem value="1">One</SelectItem>
                          <SelectItem value="2">Two</SelectItem>
                          <SelectItem value="3">Three</SelectItem>
                          <SelectItem value="4">Four</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
