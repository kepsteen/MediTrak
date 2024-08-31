import { ReactNode, createContext, useEffect, useState } from 'react';
import { readToken, readUser, removeAuth, saveAuth } from '../lib/data';

export type User = {
  userId: number;
  username: string;
  fullName: string;
  role: string;
};

export type UserContextValues = {
  user: User | undefined;
  token: string | undefined;
  handleSignIn: (user: User, token: string) => void;
  handleSignOut: () => void;
};

// Creates a React context with default values
export const UserContext = createContext<UserContextValues>({
  user: undefined,
  token: undefined,
  handleSignIn: () => undefined,
  handleSignOut: () => undefined,
});

type Props = {
  children: ReactNode;
};
export function UserProvider({ children }: Props) {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();

  useEffect(() => {
    const fetchUserAndToken = async () => {
      const user = readUser();
      const token = readToken();
      if (!user || !token) return;
      setUser(user);
      setToken(token);
    };
    fetchUserAndToken();
  }, []);

  /**
   * Updates the user and token state and saves to local storage.
   * @param user - User object
   * @param token - jwt token
   */
  function handleSignIn(user: User, token: string) {
    setUser(user);
    setToken(token);
    saveAuth(user, token);
  }

  /**
   * Clears the user and token state and removes them from local storage.
   */
  function handleSignOut() {
    setUser(undefined);
    setToken(undefined);
    removeAuth();
  }

  const contextValue = { user, token, handleSignIn, handleSignOut };
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
