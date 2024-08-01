import { Route, Routes } from 'react-router';
import './Reset.css';
import { Header } from './components/Header';
import { LandingPage } from './pages/LandingPage';
import { AddMedications } from './pages/AddMedications';
import { Toaster } from './components/ui/toaster';
import { MedicationList } from './pages/MedicationList';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<LandingPage />} />
          <Route path="medications" element={<MedicationList />} />
          <Route path="medications/add" element={<AddMedications />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}
