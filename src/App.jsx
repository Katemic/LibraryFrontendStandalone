import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ItemsPage from './pages/ItemsPage';
import ItemDetailsPage from './pages/ItemDetailsPage';
import MyLoansPage from './pages/MyLoansPage';
import MyReservationsPage from './pages/MyReservationsPage';
import MyFinesPage from './pages/MyFinesPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="items" element={<ItemsPage />} />
        <Route path="items/:id" element={<ItemDetailsPage />} />
        <Route path="my-loans" element={<ProtectedRoute><MyLoansPage /></ProtectedRoute>} />
        <Route path="my-reservations" element={<ProtectedRoute><MyReservationsPage /></ProtectedRoute>} />
        <Route path="my-fines" element={<ProtectedRoute><MyFinesPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/items" replace />} />
      </Route>
    </Routes>
  );
}
