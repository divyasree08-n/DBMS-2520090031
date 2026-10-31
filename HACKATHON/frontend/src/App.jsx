import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CollegeProvider } from './context/CollegeContext';
import { CollegeSelectorModal } from './components/CollegeSelectorModal';
import { StudentLogin } from './pages/StudentLogin';
import { StudentRegister } from './pages/StudentRegister';
import { AdminLogin } from './pages/AdminLogin';
import { StaffLogin } from './pages/StaffLogin';
import { PortalHome } from './pages/PortalHome';

export function App() {
  return (
    <CollegeProvider>
      <AuthProvider>
        <BrowserRouter>
          <CollegeSelectorModal />
          <Routes>
            {/* Public Authentication Routes */}
            <Route path="/login" element={<StudentLogin />} />
            <Route path="/register" element={<StudentRegister />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/staff/login" element={<StaffLogin />} />

            {/* Protected Main Portal */}
            <Route path="/*" element={<PortalHome />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </CollegeProvider>
  );
}

export default App;
