import { PlusIcon, XIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { AddCaregiverForm } from './AddCaregiverForm';
import { ConnectedUsers } from 'data';
import { useEffect, useState } from 'react';
import { readToken } from '@/lib/data';
import { useUser } from './useUser';

export function CaregiverAccessList() {
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUsers[]>([]);
  const [error, setError] = useState<unknown>();
  const [isOpen, setIsOpen] = useState(false);
  const token = readToken();
  const { user } = useUser();

  useEffect(() => {
    async function fetchConnectedUsers() {
      try {
        const response = await fetch('/api/requests', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok)
          throw new Error(`Response status: ${response.status}`);
        const requestsResult = (await response.json()) as ConnectedUsers[];
        setConnectedUsers(requestsResult);
      } catch (error) {
        setError(error);
      }
    }

    fetchConnectedUsers();
  }, [token]);

  async function handleResponse(
    isAccepted: boolean,
    requesterId: number,
    requestId: number
  ) {
    try {
      const response = await fetch('/api/requests/respond', {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAccepted, requesterId }),
      });
      if (!response.ok) throw new Error(`Response status: ${response.status}`);
    } catch (error) {
      setError(error);
    } finally {
      if (isAccepted) {
        setConnectedUsers(
          connectedUsers.map((connectedUser) =>
            connectedUser.requestId === requestId
              ? { ...connectedUser, status: 'Accepted' }
              : connectedUser
          )
        );
      } else {
        setConnectedUsers(
          connectedUsers.filter(
            (connectedUser) => connectedUser.requestId !== requestId
          )
        );
      }
    }
  }

  function closeModal() {
    setIsOpen(false);
  }

  if (error) {
    return <div>{`Error: ${error}`}</div>;
  }

  return (
    <>
      <Card className="min-w-[300px]">
        <CardHeader>
          <CardTitle className="flex flex-col">
            <span>
              {user?.role === 'Caregiver' ? 'Patients' : 'Caregivers'}
            </span>
          </CardTitle>
          <CardDescription>{`Manage your ${
            user?.role === 'Caregiver' ? 'patients' : 'caregivers'
          }.`}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {connectedUsers.map((connectedUser) => (
            <div
              key={connectedUser.requestId}
              className="flex items-start gap-4 p-2 -mx-2 transition-all rounded-md hover:bg-greypink hover:text-accent-foreground">
              <div className="pt-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>Requester</AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-1 ">
                <div className="flex items-center justify-between">
                  <p className="font-medium leading-none text-md">
                    {connectedUser.requesterId === user?.userId
                      ? connectedUser.requestedFullName
                      : connectedUser.requesterFullName}
                  </p>
                  {connectedUser.status === 'Pending' &&
                  connectedUser.requesterId !== user?.userId ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() =>
                          handleResponse(
                            true,
                            connectedUser.requesterId,
                            connectedUser.requestId
                          )
                        }>
                        <div className="p-1 rounded-full bg-emerald-600">
                          <PlusIcon className="w-4 h-4 text-white transition-all hover:w-5 hover:h-5" />
                        </div>
                        <span className="sr-only">Accept</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() =>
                          handleResponse(
                            false,
                            connectedUser.requesterId,
                            connectedUser.requestId
                          )
                        }>
                        <div className="p-1 rounded-full bg-ruby">
                          <XIcon className="w-4 h-4 text-white transition-all hover:w-5 hover:h-5" />
                        </div>
                        <span className="sr-only">Decline</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {connectedUser.status === 'Pending' && (
                        <p className="pl-4 text-sm text-gray-400">
                          Access request sent.
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  @{connectedUser.requesterUsername}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
              <Button asChild variant="secondary">
                <span>
                  {user?.role === 'Caregiver' ? 'Add patient' : 'Add Caregiver'}
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-md w-[80%] max-w-[550px]">
              <DialogHeader>
                <DialogTitle>
                  {`Enter the username of the ${
                    user?.role === 'Caregiver' ? 'patient' : 'caregiver'
                  } you want to add.`}
                </DialogTitle>
                <AddCaregiverForm
                  closeModal={closeModal}
                  setConnectedUsers={setConnectedUsers}
                />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </>
  );
}
