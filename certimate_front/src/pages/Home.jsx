import React from 'react';
import { 
  Search, Award, Calendar, MessageSquare, 
  TrendingUp, Star, ChevronRight, Briefcase, 
  Zap, BookOpen, MapPin, Eye, Flame, Filter
} from 'lucide-react';

/**
 * [Home 컴포넌트] 
 * 요구사항 REQ-UI-001 기반으로 제작된 반응형 메인 대시보드입니다.
 * ERD의 USER, CERTIFICATION, JOB_MATCH 테이블 데이터를 시각화합니다[cite: 27, 29].
 */

const Home = () => {
  // 사용자 전공 및 관심사 기반 가상 데이터 (ERD USER 테이블 참조) [cite: 27]
  const userData = { name: "유성찬", major: "소프트웨어 개발", matchRate: 98 };
  
  return (
    <div className="min-h-screen bg-[#EAECEF] font-sans text-[#4A4F58]">
      {/* [1. Hero Section] REQ-SRCH-001: 통합 정보 검색 보강  */}
      <header className="relative py-24 px-6 overflow-hidden bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-[#3478B8]/5 px-4 py-2 rounded-full mb-8 border border-[#3478B8]/10">
            <Zap size={14} className="text-[#D9A23A]" />
            <span className="text-[10px] font-black text-[#3478B8] uppercase tracking-widest">AI-Driven Certification Path</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-8 leading-[1.15]">
            분산된 정보를 한곳에, <br />
            <span className="text-[#3478B8]">데이터로 자격을 증명합니다.</span>
          </h1>
          <p className="text-gray-400 text-lg mb-12 font-medium max-w-2xl mx-auto">
            {userData.major} 전공 분석을 통해 도출된 맞춤형 자격증과 <br /> 실시간 시험 일정을 최우선으로 제안합니다.
          </p>
          
          {/* 보강된 통합 검색창 (REQ-SRCH-001)  */}
          <div className="relative max-w-3xl mx-auto flex flex-col md:flex-row shadow-2xl rounded-3xl overflow-hidden border border-gray-100 bg-white">
            <div className="flex items-center px-6 py-4 bg-gray-50 border-r border-gray-100">
              <Filter size={16} className="mr-2 text-[#3478B8]" />
              <select className="bg-transparent text-sm font-bold outline-none cursor-pointer">
                <option>전체 자격증</option>
                <option>국가기술</option>
                <option>민간자격</option>
              </select>
            </div>
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="자격증 명칭 또는 직무를 검색합니다..." 
                className="w-full p-6 pl-14 outline-none text-base font-medium placeholder:text-gray-300"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={22} />
            </div>
            <button className="bg-[#3478B8] text-white px-12 py-6 font-black hover:bg-[#2e69a3] transition shadow-inner">
              검색
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        
        {/* [2. Core Data Grid] REQ-RECOM-001 & REQ-SRVC-003 [cite: 22, 25] */}
        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* AI 기반 맞춤 큐레이션 (CERTIFICATION 테이블 연동) [cite: 27, 29] */}
          <div className="lg:col-span-2 bg-white rounded-[32px] p-10 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h3 className="text-2xl font-black flex items-center tracking-tight">
                  <Star className="mr-3 text-[#D9A23A]" fill="#D9A23A" size={24} />
                  성찬님 맞춤형 AI 큐레이션 (REQ-001)
                </h3>
                <p className="text-xs text-gray-400 mt-2 font-medium">보유 역량과 전공 적합도를 기반으로 산출된 추천 리스트입니다.</p>
              </div>
              <button className="text-xs font-black text-[#3478B8] flex items-center hover:translate-x-1 transition-transform">
                전체보기 <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <CertCard 
                title="정보처리산업기사" 
                tags={["#국가기술", "#SW개발"]} 
                match={userData.matchRate}
                difficulty="Level 3"
                isHot={true}
              />
              <CertCard 
                title="SQLD (개발자)" 
                tags={["#데이터", "#백엔드"]} 
                match={85}
                difficulty="Level 2"
                isHot={false}
              />
            </div>
          </div>

          {/* 실시간 일정 관리 (EXAM_SCHEDULE 테이블 연동)  */}
          <div className="bg-[#4A4F58] rounded-[32px] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
            <h3 className="text-xl font-bold mb-8 flex items-center">
              <Calendar className="mr-3 text-[#3BAA7D]" size={20} /> 시험 일정 D-Day (REQ-003)
            </h3>
            <div className="space-y-8">
              <ScheduleItem title="정보처리기사 실기" dday="D-12" date="2026.04.25" color="#3BAA7D" />
              <ScheduleItem title="SQLD 정기 시험" dday="D-45" date="2026.05.30" color="#3478B8" />
              <ScheduleItem title="토익 정기 접수" dday="D-3" date="2026.04.15" color="#D9A23A" />
            </div>
            <button className="w-full mt-12 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-black tracking-widest transition">
              통합 일정 캘린더 확인
            </button>
          </div>
        </div>

        {/* [3. Ecosystem Section] COMMUNITY & JOB_MATCH [cite: 25, 34] */}
        <div className="grid lg:grid-cols-2 gap-10">
          
          {/* 커뮤니티 데이터 (COMMUNITY 테이블 연동)  */}
          <div className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black flex items-center tracking-tight">
                <MessageSquare className="mr-3 text-[#3478B8]" size={22} /> 정보 공유 커뮤니티
              </h3>
              <div className="flex items-center text-[#3BAA7D] text-xs font-bold">
                <TrendingUp size={14} className="mr-1" /> 실시간 인기
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              <PostItem title="비전공자 정보처리산업기사 2주 합격 로드맵" category="합격후기" views={1420} isBest={true} />
              <PostItem title="SQLD 노랭이 문제집 오답 정리 스터디 모집" category="스터디" views={925} isBest={false} />
              <PostItem title="SK하이닉스 채용 시 자격증 가산점 범위" category="질문" views={3102} isBest={false} />
            </div>
          </div>

          {/* 채용 매칭 시스템 (JOB_MATCH 테이블 연동) [cite: 25, 27, 34] */}
          <div className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black mb-8 flex items-center tracking-tight">
              <Briefcase className="mr-3 text-[#D9A23A]" size={22} /> 맞춤 채용 매칭 시스템
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <JobCard company="SK하이닉스" role="생산직/SW" cert="산업기사 우대" logo="S" color="#E61E2B" />
              <JobCard company="카카오" role="백엔드 개발" cert="정처기 필수" logo="K" color="#FEE500" />
              <JobCard company="네이버" role="데이터 분석" cert="SQLD 우대" logo="N" color="#03C75A" />
              <div className="border-2 border-dashed border-gray-100 rounded-[24px] flex flex-col items-center justify-center text-gray-300 hover:text-[#3478B8] hover:bg-gray-50 transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center mb-2 group-hover:border-[#3478B8]">
                  <ChevronRight size={18} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">More Matches</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* [4. Footer] */}
      <footer className="bg-white border-t border-gray-200 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Award className="text-[#3478B8]" size={28} />
              <span className="text-2xl font-black text-[#3478B8] tracking-tighter">자격한판</span>
            </div>
            <p className="text-sm text-gray-400 font-medium tracking-tight">
              통합 자격증 데이터와 AI를 결합한 지능형 커리어 플랫폼입니다.
            </p>
          </div>
          <div className="flex space-x-12 text-sm font-bold text-gray-300">
            <a href="#" className="hover:text-[#4A4F58] transition">이용약관</a>
            <a href="#" className="hover:text-[#4A4F58] transition">개인정보처리방침</a>
            <a href="#" className="hover:text-[#4A4F58] transition">오픈 API</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- 기능별 재사용 컴포넌트 (모듈화) ---

const CertCard = ({ title, tags, match, difficulty, isHot }) => (
  <div className={`p-8 rounded-[24px] border transition-all cursor-pointer group hover:shadow-xl hover:shadow-[#3478B8]/5 ${isHot ? 'bg-[#3478B8]/5 border-[#3478B8]/20' : 'bg-gray-50 border-gray-100 hover:border-[#3478B8]'}`}>
    <div className="flex justify-between items-start mb-6">
      <div className="flex space-x-2">
        {tags.map(tag => <span key={tag} className="text-[9px] font-black px-2.5 py-1.5 bg-white rounded-lg text-gray-400 border border-gray-100 uppercase tracking-tighter">{tag}</span>)}
      </div>
      <div className="text-right">
        <span className="text-[11px] font-black text-[#3BAA7D]">{match}% Match</span>
      </div>
    </div>
    <h4 className="text-2xl font-black mb-3 group-hover:text-[#3478B8] transition-colors">{title}</h4>
    <div className="flex items-center text-xs text-gray-400 font-bold space-x-4">
      <span className="flex items-center"><BookOpen size={14} className="mr-1.5 text-gray-300" /> {difficulty}</span>
      <span className="flex items-center"><MapPin size={14} className="mr-1.5 text-gray-300" /> 전국 고사장</span>
    </div>
  </div>
);

const ScheduleItem = ({ title, dday, date, color }) => (
  <div className="flex items-center justify-between group cursor-pointer hover:translate-x-2 transition-transform">
    <div className="flex items-center space-x-5">
      <div className="w-1.5 h-12 rounded-full shadow-lg" style={{ backgroundColor: color }}></div>
      <div>
        <p className="text-base font-bold group-hover:text-[#3BAA7D] transition-colors">{title}</p>
        <p className="text-xs text-gray-400 font-medium tracking-tight">{date}</p>
      </div>
    </div>
    <span className="text-sm font-black px-3 py-1 bg-white/10 rounded-lg" style={{ color: color }}>{dday}</span>
  </div>
);

const PostItem = ({ title, category, views, isBest }) => (
  <div className="py-6 flex justify-between items-center group cursor-pointer">
    <div className="flex flex-col">
      <span className="text-[10px] font-black text-[#3478B8] uppercase mb-1.5 tracking-tighter">{category}</span>
      <h4 className="text-base font-bold group-hover:text-[#3478B8] transition-colors line-clamp-1">{title}</h4>
    </div>
    <div className="flex items-center text-gray-300 space-x-4">
      {isBest && <Flame size={16} className="text-[#D9A23A]" />}
      <div className="flex items-center space-x-1.5 font-bold">
        <Eye size={14} />
        <span className="text-[11px]">{views.toLocaleString()}</span>
      </div>
    </div>
  </div>
);

const JobCard = ({ company, role, cert, logo, color }) => (
  <div className="p-6 bg-gray-50 rounded-[24px] border border-gray-100 hover:shadow-lg hover:border-[#3478B8] transition-all cursor-pointer group">
    <div className="flex items-center space-x-3 mb-5">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-xs shadow-md group-hover:rotate-6 transition-transform" style={{ backgroundColor: color }}>{logo}</div>
      <p className="text-sm font-black">{company}</p>
    </div>
    <h4 className="text-sm font-bold mb-1.5 text-[#4A4F58] leading-tight">{role}</h4>
    <p className="text-[11px] text-[#3BAA7D] font-black tracking-tight">{cert}</p>
  </div>
);

export default Home;