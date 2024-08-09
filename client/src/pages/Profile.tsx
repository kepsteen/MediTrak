import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { PlusIcon, XIcon } from 'lucide-react';

export function Profile() {
  return (
    <>
      <section className="container flex flex-col pt-[100px] items-center gap-8 px-4 py-12 mx-auto md:px-6">
        <Tabs defaultValue="account" className="w-full">
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="connections">Caregivers</TabsTrigger>
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
            <TabsContent value="health">
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Personal Health Information</CardTitle>
                  <CardDescription>
                    Update your health information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="height">Height in</Label>
                    <Input id="height" type="number" defaultValue="68" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="weight">Weight lbs</Label>
                    <Input id="weight" type="number" defaultValue="120" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Textarea id="allergies" defaultValue="Pollen, Dust" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Input id="bloodType" defaultValue="O+" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="conditions">Medical Conditions</Label>
                    <Textarea
                      id="conditions"
                      defaultValue="Asthma, Arthritis"
                    />
                  </div>
                  <Button variant="secondary">Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="connections">
              <Card>
                <CardHeader>
                  <CardTitle>Caregivers</CardTitle>
                  <CardDescription>Manage your caregivers.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-start gap-4 p-2 -mx-2 transition-all rounded-md hover:bg-greypink hover:text-accent-foreground">
                    <div className="pt-2">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>CR</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="space-y-1 ">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium leading-none">
                          Caregiver Request 1
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full">
                            <div className="p-1 rounded-full bg-green">
                              <PlusIcon className="w-4 h-4 text-white transition-all hover:w-5 hover:h-5" />
                            </div>
                            <span className="sr-only">Accept</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full">
                            <div className="p-1 bg-red-500 rounded-full">
                              <XIcon className="w-4 h-4 text-white transition-all hover:w-5 hover:h-5" />
                            </div>
                            <span className="sr-only">Decline</span>
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        caregiver1@example.com
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="secondary">Add caregiver</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </section>
    </>
  );
}
