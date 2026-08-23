import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="relative w-full min-h-[calc(100vh-64px)] flex flex-col justify-between overflow-hidden bg-slate-900">
      
      {/* 1. 배경 이미지 + 오버레이 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/background.jpg')" }} // 실제 이미지 경로에 맞게 확인하세요
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* 2. 메인 컨텐츠 영역 (좌측 중앙 정렬) 
          justify-center를 추가하여 화면 세로의 정중앙에 오도록 만듭니다. */}
      <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-20 flex-1 flex flex-col justify-center">
        
        {/* text-left와 items-start로 요소들을 왼쪽으로 가지런히 정렬합니다. */}
        <div className="max-w-3xl animate-fade-in-up text-left">
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight tracking-tight mb-6">
            숨겨진 능력을 발견해서<br />합격의 순간까지
          </h1>
          <p className="text-blue-200 text-lg md:text-xl mb-10 font-medium">
            당신의 남다른 능력, CertiMate가 함께 만들어 갑니다.
          </p>

          {/* 검색창 */}
          <div className="bg-white rounded-full flex items-center px-6 py-4 mb-8 w-full max-w-xl shadow-2xl">
            <input 
              type="text" 
              placeholder="무엇을 찾으시나요? (예: 정보처리기사)" 
              className="flex-1 outline-none text-slate-800 text-lg bg-transparent"
            />
            <button className="text-slate-400 hover:text-blue-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* 카테고리 버튼들 */}
          <div className="flex flex-wrap gap-3">
            <CategoryPill text="기사/산업기사" active={true} />
            <CategoryPill text="어학/회화" />
            <CategoryPill text="IT/컴퓨터" />
            <CategoryPill text="공무원" />
          </div>
        </div>

      </div>

     {/* 3. 하단 퀵 메뉴 바 */}
      <div className="relative z-10 w-full border-t border-white/20 bg-black/40 backdrop-blur-md">
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-20 py-5">
          {/* 수정 포인트: 5칸(grid-cols-5)에서 4칸(grid-cols-4)으로 변경했습니다. */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <BottomMenuBox title="AI 학습관" link="/study" />
            <BottomMenuBox title="캘린더" link="/calendar" />
            <BottomMenuBox title="커뮤니티" link="/community" />
            <BottomMenuBox title="마이페이지" link="/profile" />
          </div>
        </div>
      </div>

    </div>
  );
};

/* --- 재사용 가능한 UI 컴포넌트들 --- */
const CategoryPill = ({ text, active }) => (
  <button 
    className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 border border-blue-600' 
        : 'bg-black/30 text-white border border-white/40 hover:bg-white/20'
    }`}
  >
    {text}
  </button>
);

const BottomMenuBox = ({ title, link }) => (
  <Link 
    to={link}
    className="group flex items-center justify-center h-14 px-4 rounded-lg border border-white/20 bg-white/5 hover:bg-white text-white hover:text-slate-900 transition-all duration-300"
  >
    <span className="font-semibold text-sm md:text-base tracking-wide text-center break-keep">
      {title}
    </span>
  </Link>
);

export default Home;