import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Study from './pages/Study';
import Calendar from './pages/Calendar';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Login from './pages/Login';
import Admin from './pages/Admin';
import KakaoCallback from './pages/KakaoCallback'; 
// 🚨 [새로 추가된 비밀번호 찾기 페이지]
import FindPassword from './pages/FindPassword'; 

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#EAECEF] font-sans text-[#4A4F58]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/study" element={<Study />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
          {/* 🚨 비밀번호 찾기 주소 연결 */}
          <Route path="/find-password" element={<FindPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;