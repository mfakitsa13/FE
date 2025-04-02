import React from 'react';
import LoginPage from './components/auth/LoginPage';
import DashboardPage from './components/userspage/DashboardPage';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Navbar from './components/layout/Navbar';
import './App.css';
import FooterComponent from './components/layout/Footer'; 
import DrivingSchoolsPage from './components/userspage/DrivingSchoolsPage'
import StudentsPage from './components/userspage/StudentsPage'
import CreateDrivingSchool from './components/services/CreateDrivingSchool'
import EditDrivingSchool from './components/services/EditDrivingSchool'
import CreateStudent from './components/services/CreateStudent'
import EditStudent from './components/services/EditStudent'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
         <Navbar />
             <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/driving-schools" element={<DrivingSchoolsPage />} />
                    <Route path="/driving-schools/create" element={<CreateDrivingSchool />} />
                    <Route path="/driving-schools/edit/:drivingschoolid" element={<EditDrivingSchool />} />
                    <Route path="/students" element={<StudentsPage />} />
                    <Route path="/students/create" element={<CreateStudent />} />
                    <Route path="/students/edit/:studentid" element={<EditStudent />} />
                </Route>
            </Routes>
         <FooterComponent />
    </BrowserRouter>
  );
}

export default App;
