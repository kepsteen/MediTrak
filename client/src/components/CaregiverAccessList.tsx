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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { AddCaregiverForm } from './AddCaregiverForm';
import {
  ConnectedUsers,
  fetchConnectedUsers,
  acceptRequest,
  deleteRequest,
} from '@/lib/data';
import { useCallback, useEffect, useState } from 'react';
import { useUser } from './useUser';
import { useToast } from './ui/use-toast';

export function CaregiverAccessList() {
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUsers[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();

  /**
   * Callback that fetches the connected users and updates the connectedUsers state
   * on error updates the error state
   */
  const fetchConnectedUsersCallback = useCallback(async () => {
    try {
      const requests = await fetchConnectedUsers();
      setConnectedUsers(requests);
    } catch (error) {
      toast({ title: String(error), variant: 'destructive' });
    }
  }, [toast]);

  useEffect(() => {
    fetchConnectedUsersCallback();
  }, [fetchConnectedUsersCallback]);

  /**
   * Handles the user's response to a pending Request
   * @param isAccepted - True if user accepts the request
   * @param requesterId - Id of the user who sent the request
   * @param requestId - Id of the request
   */
  async function handleResponse(
    isAccepted: boolean,
    requesterId: number,
    requestId: number
  ) {
    try {
      if (isAccepted) {
        await acceptRequest(requesterId);
        setConnectedUsers(
          connectedUsers.map((connectedUser) =>
            connectedUser.requestId === requestId
              ? { ...connectedUser, status: 'Accepted' }
              : connectedUser
          )
        );
      } else {
        await deleteRequest(requesterId);
        setConnectedUsers(
          connectedUsers.filter(
            (connectedUser) => connectedUser.requestId !== requestId
          )
        );
      }
    } catch (error) {
      toast({ title: String(error), variant: 'destructive' });
    }
  }

  function closeModal() {
    setIsOpen(false);
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
                  @
                  {connectedUser.requesterId === user?.userId
                    ? connectedUser.requestedUsername
                    : connectedUser.requesterUsername}
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
                <DialogDescription>Add a connected account.</DialogDescription>
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
