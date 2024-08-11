import { CaregiverAccessList } from '@/components/CaregiverAccessList';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/components/useUser';

export function Profile() {
  const { user } = useUser();
  return (
    <>
      <section className="container flex flex-col pt-[100px] items-center gap-8 px-4 py-12 mx-auto md:px-6">
        <Tabs defaultValue="account" className="w-full">
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="connections">
                {user?.role === 'Patient' ? 'Caregivers' : 'Patients'}
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="flex justify-center">
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Details</CardTitle>
                  <CardDescription>
                    Manage your account information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input type="text" id="full-name" />
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="username">Username</Label>
                    <Input type="text" id="username" disabled />
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input type="password" id="password" />
                  </div>
                  <Button variant="secondary">Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="connections">
              <CaregiverAccessList />
            </TabsContent>
          </div>
        </Tabs>
      </section>
    </>
  );
}
