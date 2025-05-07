import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MedicalEquipment from "./Pages/MedicalEquipment";
import Login2 from './Pages/Login';
import SignUpPage2 from './Pages/Signup';
import ForgotPassword from "./Pages/Forgotpassword";
import Dashboard from "./Pages/Dashboard";
import MyEquipment from "./Pages/MyEquipment";
import RentEquip from "./Pages/RentEquip";
import Profile from "./Pages/Profile"
import Settings from "./Pages/Settings";
import AuthGuard from "./Components/AuthGuard";
import EquipmentDetails from "./Pages/EquipmentDetails";
import Favoris from "./Pages/Favoris";
import Checkout from './Pages/Checkout';
import AdminDashboard from "./Pages/admin/AdminDashboard";
import AdminUsers from "./Pages/admin/Users";
import AdminEquipment from "./Pages/admin/AdminEquipment";
import AdminSettings from "./Pages/admin/Settings";
import Requests from "./Pages/Requests";


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<MedicalEquipment />} />
        <Route path="/login2" element={<Login2 />} />
        <Route path="/signup2" element={<SignUpPage2 />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/rent-equip" element={<RentEquip />} /> 
        <Route path="/equipment/:id" element={<EquipmentDetails />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Protected routes with Layout */}
        <Route >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-equipment" element={<MyEquipment />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/chat" element={<div>Chat Page</div>} />
          <Route path="/favorites" element={<Favoris />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />

            {/*Admin protected routes */}
          <Route path="/admin/dashboard" element={
            <AuthGuard>
              <AdminDashboard />
            </AuthGuard>
          } />
          <Route path="/admin/users" element={
            <AuthGuard>
              <AdminUsers />
            </AuthGuard>
          } />
          <Route path="/admin/equipment" element={
            <AuthGuard>
              <AdminEquipment />
            </AuthGuard>
          } />
          <Route path="/admin/settings" element={
            <AuthGuard>
              <AdminSettings />
            </AuthGuard>
          } />

        </Route>
      </Routes>
    </Router>
  );
};

export default App;
