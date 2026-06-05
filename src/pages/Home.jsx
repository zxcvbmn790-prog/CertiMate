import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    // 전체 화면 높이에서 네비게이션 바 높이 정도를 뺀 전체 공간 차지
    <div className="relative w-full min-h-[calc(100vh-64px)] flex flex-col justify-between overflow-hidden bg-slate-900">
      
      {/* 1. 배경 이미지 + 어두운 오버레이 (디자인 꿀팁!) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/background.jpg')" }}
      >
        {/* [디자이너의 디테일] 
          사진만 덩그러니 넣으면 하얀색 글씨가 사진 배경에 묻혀서 안 보일 수 있습니다.
          사진 위에 검은색 반투명한 막(bg-black/60)을 한 겹 덮어주면 글씨가 훨씬 선명해집니다.
        */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* 2. 메인 컨텐츠 영역 (좌측 정렬 텍스트 + 검색창 + 카테고리) */}
      <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-20 pt-20 pb-10 flex-1 flex flex-col">
        
        <div className="max-w-3xl animate-fade-in-up mt-10">
          {/* 헤드라인 텍스트 */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight tracking-tight mb-6">
            숨겨진 능력을 발견해서<br />합격의 순간까지
          </h1>
          <p className="text-blue-200 text-lg md:text-xl mb-12 font-medium">
            당신의 남다른 능력, CertiMate가 함께 만들어 갑니다.
          </p>

          {/* 검색창 (HRD 스타일의 둥글고 큼직한 검색바) */}
          <div className="bg-white rounded-full flex items-center px-6 py-4 mb-10 w-full max-w-xl shadow-2xl">
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

          {/* 카테고리 버튼들 (청년, 기업, 근로자 등 버튼 역할) */}
          <div className="flex flex-wrap gap-3">
            <CategoryPill text="기사/산업기사" active={true} />
            <CategoryPill text="어학/회화" />
            <CategoryPill text="IT/컴퓨터" />
            <CategoryPill text="공무원" />
          </div>
        </div>

      </div>

      {/* 3. 하단 퀵 메뉴 바 (화면 맨 아래에 가로로 넓게 퍼지는 투명 박스들) */}
      <div className="relative z-10 w-full border-t border-white/20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-20 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <BottomMenuBox title="국가자격시험" link="/calendar" />
            <BottomMenuBox title="기출문제 풀이" link="/study" />
            <BottomMenuBox title="스터디 모집" link="/community" />
            <BottomMenuBox title="합격 후기" link="/community" />
            <BottomMenuBox title="나의 진도율" link="/profile" />
            <BottomMenuBox title="공지사항" link="/" />
          </div>
        </div>
      </div>

    </div>
  );
};

/* --- 재사용 가능한 UI 컴포넌트들 --- */

// 동그란 카테고리 버튼 컴포넌트
const CategoryPill = ({ text, active }) => (
  <button 
    className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
      active 
        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
        : 'bg-white/10 text-white border border-white/30 hover:bg-white/20'
    }`}
  >
    {text}
  </button>
);

// 하단 네모난 퀵 메뉴 박스 컴포넌트
const BottomMenuBox = ({ title, link }) => (
  <Link 
    to={link}
    className="group flex items-center justify-center h-16 px-4 rounded-lg border border-white/30 hover:bg-white text-white hover:text-slate-900 transition-all duration-300"
  >
    <span className="font-medium text-sm md:text-base text-center break-keep">
      {title}
    </span>
  </Link>
);

export default Home;