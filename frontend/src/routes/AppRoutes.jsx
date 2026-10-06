import { Routes, Route } from "react-router-dom";

import Intro from "../pages/Intro";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";

import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Deposit from "../pages/Deposit";
import Withdraw from "../pages/Withdraw";
import Transactions from "../pages/Transactions";
import Goals from "../pages/Goals";
import Transfer from "../pages/Transfer";

import Feedback from "../pages/Feedback";
import AdminFeedbacks from "../pages/AdminFeedbacks";

import AdminDashboard from "../pages/AdminDashboard";
import AdminUsers from "../pages/AdminUsers";
import AdminTransactions from "../pages/AdminTransactions";
import AdminGoals from "../pages/AdminGoals";
import AdminCreateUser from "../pages/AdminCreateUser";
import AdminAutoSavings from "../pages/AdminAutoSavings";
import AdminDisabledGoals from "../pages/AdminDisabledGoals";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Intro always loads first */}
        <Route path="/" element={<Intro />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* USER ROUTES */}

      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute><Profile /></ProtectedRoute>
      } />

      <Route path="/deposit" element={
        <ProtectedRoute><Deposit /></ProtectedRoute>
      } />

      <Route path="/withdraw" element={
        <ProtectedRoute><Withdraw /></ProtectedRoute>
      } />

      <Route path="/transactions" element={
        <ProtectedRoute><Transactions /></ProtectedRoute>
      } />

      <Route path="/goals" element={
        <ProtectedRoute><Goals /></ProtectedRoute>
      } />

      <Route path="/transfer" element={
        <ProtectedRoute><Transfer /></ProtectedRoute>
      } />

      <Route path="/feedback" element={
        <ProtectedRoute><Feedback /></ProtectedRoute>
      } />

      {/* ADMIN ROUTES */}

      <Route path="/admin" element={
        <ProtectedRoute><AdminDashboard /></ProtectedRoute>
      } />

      <Route path="/admin/users" element={
        <ProtectedRoute><AdminUsers /></ProtectedRoute>
      } />

      <Route path="/admin/transactions" element={
        <ProtectedRoute><AdminTransactions /></ProtectedRoute>
      } />

      <Route path="/admin/goals" element={
        <ProtectedRoute>
          <AdminRoute>
            <AdminGoals />
          </AdminRoute>
        </ProtectedRoute>
      } />

      <Route path="/admin/disabled-goals" element={
        <ProtectedRoute>
          <AdminRoute>
            <AdminDisabledGoals />
          </AdminRoute>
        </ProtectedRoute>
      } />

      <Route path="/admin/create-user" element={
        <ProtectedRoute>
          <AdminRoute>
            <AdminCreateUser />
          </AdminRoute>
        </ProtectedRoute>
      } />

      <Route path="/admin/auto-savings" element={
        <ProtectedRoute>
          <AdminRoute>
            <AdminAutoSavings />
          </AdminRoute>
        </ProtectedRoute>
      } />

      <Route path="/admin/feedbacks" element={
        <ProtectedRoute>
          <AdminRoute>
            <AdminFeedbacks />
          </AdminRoute>
        </ProtectedRoute>
      } />

    </Routes>
  );
}
