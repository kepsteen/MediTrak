import { CaregiverAccessList } from '@/components/CaregiverAccessList';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/components/useUser';
import {
  fetchNotificationSetting,
  updateNotificationSetting,
} from '@/lib/data';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export function Profile() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [notificationSetting, setNotificationSetting] = useState(false);
  const { toast } = useToast();

  const notificationSettingCallback = useCallback(async () => {
    try {
      const setting = await fetchNotificationSetting();
      setNotificationSetting(setting.notificationsEnabled);
    } catch (error) {
      toast({ title: String(error), variant: 'destructive' });
    }
  }, [toast]);

  useEffect(() => {
    if (!user) navigate('/sign-in');
    notificationSettingCallback();
  }, [navigate, user, notificationSettingCallback]);

  return (
    <>
      {user && (
        <section className="container flex flex-col pt-[100px] items-center gap-8 px-4 py-12 mx-auto md:px-6">
          <Tabs defaultValue="account" className="w-full">
            <div className="flex justify-center">
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="connections">
                  {user?.role === 'Patient' ? 'Caregivers' : 'Patients'}
                </TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
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
                      <Input
                        type="text"
                        id="full-name"
                        defaultValue={user?.fullName}
                        readOnly
                      />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        type="text"
                        id="username"
                        defaultValue={user?.username}
                        readOnly
                      />
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="role">Role</Label>
                      <Input
                        type="text"
                        id="role"
                        defaultValue={user?.role}
                        readOnly
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="connections">
                <CaregiverAccessList />
              </TabsContent>
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Change your text notification settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center space-x-2">
                      <p className="text-lg">Off</p>
                      <Switch
                        id="notification-setting"
                        checked={notificationSetting}
                        onCheckedChange={async () => {
                          setNotificationSetting((prev) => !prev);
                          await updateNotificationSetting();
                        }}
                      />
                      <p className="text-lg">On</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </section>
      )}
    </>
  );
}
