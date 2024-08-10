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
import { CaregiverAccess, Requests } from 'data';
import { useEffect, useState } from 'react';
import { readToken } from '@/lib/data';
import { useUser } from './useUser';

export function CaregiverAccessList() {
  const [requests, setRequests] = useState<Requests[]>([]);
  const [error, setError] = useState<unknown>();
  const token = readToken();
  const { user } = useUser();

  useEffect(() => {
    fetchRequests();
  });

  async function fetchRequests() {
    try {
      const response = await fetch('/api/requests', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`Response status: ${response.status}`);
      const requestsResult = (await response.json()) as Requests[];
      console.log('requestsResult', requestsResult);
      setRequests(requestsResult);
    } catch (error) {
      setError(error);
    }
  }

  async function handleResponse(
    isAccepted: boolean,
    requesterId: number,
    indexToRemove: number
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
      const result = (await response.json()) as CaregiverAccess;
      console.log('result', result);
    } catch (error) {
      setError(error);
    } finally {
      setRequests(requests.filter((_, index) => index !== indexToRemove));
    }
  }

  if (error) {
    return <div>{`Error: ${error}`}</div>;
  }
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            {user?.role === 'Caregiver' ? 'Patients' : 'Caregivers'}
          </CardTitle>
          <CardDescription>{`Manage your ${
            user?.role === 'Caregiver' ? 'patients' : 'caregivers'
          }.`}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {requests.map((request, index) => (
            <div
              key={request.requestId}
              className="flex items-start gap-4 p-2 -mx-2 transition-all rounded-md hover:bg-greypink hover:text-accent-foreground">
              <div className="pt-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>Requester</AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-1 ">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">
                    {request.requesterFullName}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={() =>
                        handleResponse(true, request.requesterId, index)
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
                        handleResponse(false, request.requesterId, index)
                      }>
                      <div className="p-1 rounded-full bg-ruby">
                        <XIcon className="w-4 h-4 text-white transition-all hover:w-5 hover:h-5" />
                      </div>
                      <span className="sr-only">Decline</span>
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {request.requesterUsername}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Dialog>
            <DialogTrigger>
              <Button variant="secondary">Add caregiver</Button>
            </DialogTrigger>
            <DialogContent className="rounded-md w-[80%] max-w-[550px]">
              <DialogHeader>
                <DialogTitle>
                  Enter the username of the Caregiver you want to add.
                </DialogTitle>
                <DialogDescription>
                  <AddCaregiverForm />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </>
  );
}
