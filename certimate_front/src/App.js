import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Study from './pages/Study';
import Calendar from './pages/Calendar';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Login from './pages/Login'
import Admin from './pages/Admin'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#EAECEF] font-sans text-[#4A4F58]">
        {/* 모든 화면에서 공통으로 사용되는 상단 네비게이션입니다. */}
        <Navbar />
        
        {/* 각 URL 경로에 따라 렌더링될 화면을 정의합니다. */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/study" element={<Study />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} /> {/* 로그인 경로 추가 */}
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;