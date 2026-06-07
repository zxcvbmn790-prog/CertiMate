import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  // -------------------------------------------------------------
  // [1] 상태 관리 (State Management)
  // 검색창에 사용자가 입력하는 텍스트를 실시간으로 저장하는 공간입니다.
  // -------------------------------------------------------------
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();

  // -------------------------------------------------------------
  // [2] 검색 로직 (Business Logic)
  // 돋보기 버튼을 누르거나 엔터키를 쳤을 때 실행되는 함수입니다.
  // 초보자를 위한 설명: 여기서 백엔드(Spring Boot)로 검색어를 보내서
  // DB의 CERTIFICATION 테이블을 조회하게 될 핵심 뼈대입니다.
  // -------------------------------------------------------------
  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      alert("검색어를 입력해 주세요!");
      return;
    }
    // 향후 검색 결과 페이지(예: /study?query=검색어)로 이동시키는 로직이 들어갈 곳입니다.
    alert(`"${searchKeyword}" 자격증을 검색합니다! (기능 준비중)`);
    // navigate(`/study?query=${encodeURIComponent(searchKeyword)}`); 
  };

  const handleKeyDown = (e) => {
    // 사용자가 엔터(Enter) 키를 누르면 바로 검색이 실행되도록 UX를 개선했습니다.
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // -------------------------------------------------------------
  // [3] 화면 렌더링 (View)
  // 팀원의 기존 UI 코드를 유지하되, 리액트의 동작 원리에 맞게 결합했습니다.
  // -------------------------------------------------------------
  return (
    <div className="relative w-full min-h-[calc(100vh-64px)] flex flex-col justify-between overflow-hidden bg-slate-900">
      
      {/* 배경 이미지 영역 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/background.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* 메인 콘텐츠 영역 (타이틀 및 검색창) */}
      <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-20 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl animate-fade-in-up text-left">
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight tracking-tight mb-6">
            내일을 바꾸는<br />당신의 첫걸음
          </h1>
          <p className="text-blue-200 text-lg md:text-xl mb-10 font-medium">
            맞춤형 자격증 추천부터 기출문제 학습까지,<br />모든 것을 한 곳에서 해결하세요 CertiMate
          </p>

          {/* 검색창 컨테이너 */}
          <div className="bg-white rounded-full flex items-center px-6 py-4 mb-8 w-full max-w-xl shadow-2xl">
            <input 
              type="text" 
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="관심있는 자격증을 검색해보세요" 
              className="flex-1 outline-none text-slate-800 text-lg bg-transparent"
            />
            {/* 검색 실행 버튼 */}
            <button 
              onClick={handleSearch}
              className="text-slate-400 hover:text-blue-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* 추천 키워드 영역 (향후 백엔드 데이터 연동 예정) */}
          <div className="flex flex-wrap gap-3">
            {/* 지금은 하드코딩이지만, 추후 map() 함수를 써서 DB 데이터를 뿌려줄 뼈대입니다. */}
            <CategoryPill text="정보처리기사" active={true} onClick={() => setSearchKeyword('정보처리기사')} />
            <CategoryPill text="한국사능력검정" onClick={() => setSearchKeyword('한국사능력검정')} />
            <CategoryPill text="IT/컴퓨터" onClick={() => setSearchKeyword('IT/컴퓨터')} />
            <CategoryPill text="외국어" onClick={() => setSearchKeyword('외국어')} />
          </div>

        </div>
      </div>

      {/* 하단 퀵 메뉴 영역 */}
      <div className="relative z-10 w-full border-t border-white/20 bg-black/40 backdrop-blur-md">
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-20 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <BottomMenuBox title="AI 추천 자격증" link="/study" />
            <BottomMenuBox title="시험 일정 달력" link="/calendar" />
            <BottomMenuBox title="합격 후기 게시판" link="/community" />
            <BottomMenuBox title="내 학습 진도" link="/profile" />
          </div>
        </div>
      </div>

    </div>
  );
};

/* --- 하위 UI 컴포넌트들 (성능을 위해 메인 컴포넌트 밖으로 분리) --- */

// 카테고리 태그 컴포넌트
const CategoryPill = ({ text, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 border border-blue-600' 
        : 'bg-black/30 text-white border border-white/40 hover:bg-white/20'
    }`}
  >
    {text}
  </button>
);

// 하단 메뉴 박스 컴포넌트
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