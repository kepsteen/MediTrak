import { Route, Routes } from 'react-router';
import './Reset.css';
import { Header } from './components/Header';
import { LandingPage } from './pages/LandingPage';
import { AddMedications } from './pages/AddMedications';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<LandingPage />} />
          <Route path="add-medications" element={<AddMedications />} />
        </Route>
      </Routes>
    </>
  );
}
