import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Award, UserPlus, LogIn, User, ShieldCheck } from 'lucide-react'; // ShieldCheck 아이콘 추가

const Navbar = () => {
  const location = useLocation();
  
  // 현재 활성화된 페이지인지 확인하는 함수입니다.
  const isActive = (path) => location.pathname === path;

  // 가상의 관리자 여부 확인 변수입니다. (추후 실제 유저 데이터와 연동하세요)
  const isAdmin = true; 

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-300 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* 1. 서비스 로고 영역 */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-[#3478B8] rounded flex items-center justify-center text-white group-hover:rotate-12 transition-transform shadow-lg shadow-[#3478B8]/20">
            <Award size={18} />
          </div>
          <span className="text-xl font-bold tracking-tighter text-[#3478B8]">자격한판</span>
        </Link>
        
        {/* 2. 주요 서비스 메뉴 (내 정보 포함) */}
        <div className="hidden md:flex space-x-10 text-sm font-semibold">
          <Link to="/" className={`${isActive('/') ? 'text-[#3478B8]' : 'text-[#4A4F58] hover:text-[#3478B8]'} transition`}>홈</Link>
          <Link to="/study" className={`${isActive('/study') ? 'text-[#3478B8]' : 'text-[#4A4F58] hover:text-[#3478B8]'} transition`}>학습관</Link>
          <Link to="/calendar" className={`${isActive('/calendar') ? 'text-[#3478B8]' : 'text-[#4A4F58] hover:text-[#3478B8]'} transition`}>일정</Link>
          <Link to="/community" className={`${isActive('/community') ? 'text-[#3478B8]' : 'text-[#4A4F58] hover:text-[#3478B8]'} transition`}>커뮤니티</Link>
          
          <Link to="/profile" className={`flex items-center ${isActive('/profile') ? 'text-[#3478B8]' : 'text-[#4A4F58] hover:text-[#3478B8]'} transition`}>
            <User size={14} className="mr-1.5" /> 내 정보
          </Link>
        </div>

        {/* 3. 인증 및 어드민 전환 영역 */}
        <div className="flex items-center space-x-4">
          {/* [추가된 부분] 관리자 권한일 때만 보이는 관리자 페이지 이동 태그 */}
          {isAdmin && (
            <Link 
              to="/admin" 
              className="mr-2 flex items-center px-3 py-1.5 bg-[#3478B8]/5 border border-[#3478B8]/20 text-[#3478B8] rounded-full hover:bg-[#3478B8]/10 transition-colors"
            >
              <ShieldCheck size={12} className="mr-1.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Admin Mode</span>
            </Link>
          )}

          <Link to="/register" className="text-xs font-black text-gray-400 hover:text-[#3478B8] flex items-center transition uppercase tracking-tighter">
            <UserPlus size={14} className="mr-1.5" /> 회원가입
          </Link>
          
          <Link to="/login" className="bg-[#3478B8] text-white text-xs font-black px-5 py-2.5 rounded-xl shadow-lg shadow-[#3478B8]/20 hover:bg-[#2e69a3] transition flex items-center uppercase tracking-tighter">
            <LogIn size={14} className="mr-1.5" /> 로그인
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;