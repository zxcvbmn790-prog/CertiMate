import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [elapsedTime, setElapsedTime] = useState('00:00:00'); // 🚨 실시간 카운터용 상태

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const loginTime = localStorage.getItem('loginTime');

      if (loggedIn && loginTime) {
        setIsLoggedIn(true);

        // 🚨 [핵심] 1초마다 접속 유지 시간을 계산하는 타이머(스톱워치)
        const timer = setInterval(() => {
          const now = new Date().getTime();
          const diff = now - parseInt(loginTime);
          const twoHours = 2 * 60 * 60 * 1000;

          if (diff >= twoHours) {
            clearInterval(timer);
            handleLogout("보안을 위해 2시간이 경과하여 자동 로그아웃 되었습니다.");
          } else {
            // 남은 시간을 00:00:00 포맷으로 변환
            const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
            const minutes = Math.floor((diff / (1000 * 60)) % 60).toString().padStart(2, '0');
            const seconds = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
            
            setElapsedTime(`${hours}:${minutes}:${seconds}`);
          }
        }, 1000); // 1000ms = 1초마다 실행

        // 컴포넌트가 화면에서 사라질 때 타이머 청소
        return () => clearInterval(timer);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = (message = "로그아웃 되었습니다.") => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loginTime');
    setIsLoggedIn(false);
    alert(message);
    window.location.href = '/'; 
  };

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-black text-[#3478B8]">
        CertiMate
      </Link>

      <div className="flex space-x-6 font-bold text-gray-500">
        <Link to="/" className="hover:text-[#3478B8] transition">홈</Link>
        <Link to="/community" className="hover:text-[#3478B8] transition">커뮤니티</Link>
        
        {isLoggedIn && (
          <Link to="/study" className="hover:text-[#3478B8] transition">학습관</Link>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            {/* 🚨 실시간 스톱워치 출력부 */}
            <span className="text-[12px] text-[#3478B8] font-bold bg-[#3478B8]/10 px-3 py-1.5 rounded-full font-mono flex items-center">
              <span className="mr-1 text-gray-500">접속시간</span> {elapsedTime}
            </span>
            <Link to="/profile" className="text-sm font-bold text-[#3478B8] hover:underline">
              내정보
            </Link>
            <button 
              onClick={() => handleLogout()}
              className="text-sm bg-gray-100 px-4 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-200 transition"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="text-sm font-bold text-gray-600 hover:text-[#3478B8] transition">
              로그인
            </Link>
            <Link to="/register" className="text-sm bg-[#3478B8] text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-[#2a6296] transition">
              회원가입
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;