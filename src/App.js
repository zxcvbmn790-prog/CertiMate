import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Study from './pages/Study';
import Calendar from './pages/Calendar';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Login from './pages/Login';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      {/* 
        [1] Global Wrapper: 전체 앱의 바탕이 되는 도화지입니다.
        - bg-slate-50: 완전한 흰색보다 눈이 덜 피로하고 고급스러운 오프화이트 톤
        - text-slate-800: 완전한 검은색(#000)보다 가독성이 좋은 짙은 차콜 톤
        - antialiased: 폰트 렌더링을 부드럽게 만들어 맥(Mac) 환경처럼 깔끔하게 보이게 함
        - flex & min-h-screen: 화면 높이가 작아도 최소한 브라우저 높이만큼은 채우도록 보장
      */}
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col">
        
        {/* 상단 네비게이션 바 (고정된 레이아웃 요소) */}
        <Navbar />

        {/* 
          [2] Main Content Area: 실제 컨텐츠가 담기는 핵심 영역입니다.
          - flex-1: Navbar가 차지하고 남은 아래 공간을 모두 꽉 채웁니다.
          - w-full & max-w-screen-xl: 모니터가 아무리 커져도 최대 가로폭(약 1280px)을 제한하여 컨텐츠가 흩어지지 않게 함
          - mx-auto: 화면 중앙 정렬
          - px-4 sm:px-6 lg:px-8: 모바일, 태블릿, PC 사이즈별로 양옆 여백을 다르게 주어 반응형 대응
          - py-8 sm:py-12: 위아래 숨통을 틔워주는 여백
        */}
        <main className="flex-1 w-full flex flex-col">
          {/* Routes: URL에 따라 알맞은 페이지(Page)를 갈아끼우는 역할 */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/study" element={<Study />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;