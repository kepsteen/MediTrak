import { AddMedForm } from '@/components/AddMedForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/components/useUser';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

export function AddMedications() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { patientId } = useParams();
  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    }
  }, [navigate, user]);

  return (
    <>
      {user && (
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
              <AddMedForm patientId={Number(patientId)} />
            </CardContent>
          </Card>
        </section>
      )}
    </>
  );
}
