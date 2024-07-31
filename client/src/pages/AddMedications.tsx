import { AddMedForm } from '@/components/AddMedForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function AddMedications() {
  return (
    <>
      <section className="container pt-[110px] pb-[40px]">
        <Card className="mx-auto max-w-[800px]">
          <CardHeader>
            <CardTitle className="text-center">Add Medications</CardTitle>
            <CardDescription className="text-center">
              Input your medication details to update your medication list and
              view your schedules
            </CardDescription>
            <Separator />
          </CardHeader>
          <CardContent>
            <AddMedForm />
          </CardContent>
        </Card>
      </section>
    </>
  );
}
