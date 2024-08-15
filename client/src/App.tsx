import { Route, Routes } from 'react-router';
import './Reset.css';
import { Header } from './components/Header';
import { LandingPage } from './pages/LandingPage';
import { AddMedications } from './pages/AddMedications';
import { Toaster } from './components/ui/toaster';
import { MedicationsLayout } from './pages/MedicationsLayout';
import { AuthPage } from './pages/AuthPage';
import { UserProvider } from './components/UserContext';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Header />}>
            <Route index element={<LandingPage />} />
            <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
            <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
            <Route path="medications" element={<MedicationsLayout />} />
            <Route
              path="medications/add/:patientId"
              element={<AddMedications />}
            />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<NotFound />}></Route>
          </Route>
        </Routes>
        <Toaster />
      </UserProvider>
    </>
  );
}
