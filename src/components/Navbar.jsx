import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* justify-between을 사용해 양끝으로 로고와 우측 버튼을 밀어냅니다 */}
        <div className="flex justify-between items-center h-16">
          
          {/* 1. 좌측 로고 영역 */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-blue-600 text-2xl">📘</span>
              <span className="text-xl font-extrabold text-blue-600 tracking-tighter">
                CertiMate
              </span>
            </Link>
          </div>

          {/* (기존에 있던 가운데 메뉴 영역은 삭제했습니다) */}

          {/* 2. 우측 유저 액션 영역 */}
          <div className="flex items-center space-x-3">
            <button className="text-xs font-medium text-slate-500 border border-slate-300 rounded-full px-3 py-1.5 hover:bg-slate-50">
              ADMIN MODE
            </button>
            <Link to="/register" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2">
              회원가입
            </Link>
            <Link to="/login" className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              로그인
            </Link>
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;