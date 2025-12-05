import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import StudentsPage from './pages/StudentsPage.jsx';
import BooksPage from './pages/BooksPage.jsx';
import TransactionsPage from './pages/TransactionsPage.jsx';
import BorrowPage from './pages/BorrowPage.jsx';
import ReturnPage from './pages/ReturnPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import AccountsPage from './pages/AccountsPage.jsx';

function RequireAuth({ children }) {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Token exists, let it through
  // If token is invalid, API interceptor will handle 401 and redirect
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/app"
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="borrow" element={<BorrowPage />} />
        <Route path="return" element={<ReturnPage />} />
        <Route path="accounts" element={<AccountsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


