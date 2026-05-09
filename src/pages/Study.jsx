import React, { useState } from 'react';
import { Cpu, Timer, CheckCircle, XCircle, Search, BookOpen, RotateCcw, ChevronRight } from 'lucide-react';

const Study = () => {
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [selectedCert, setSelectedCert] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isGraded, setIsGraded] = useState(false);

  // ERD 및 요구사항 기반 자격증 리스트 (REQ-DATA-001 데이터 수집 대상)
  const certifications = [
    { id: 1, name: "정보처리산업기사", category: "국가기술", questions: 20 },
    { id: 2, name: "SQLD (개발자)", category: "민간자격", questions: 15 },
    { id: 3, name: "리눅스마스터 2급", category: "국가기술", questions: 25 },
    { id: 4, name: "네트워크관리사 2급", category: "민간자격", questions: 20 },
    { id: 5, name: "데이터분석준전문가(ADsP)", category: "민간자격", questions: 30 }
  ];

  // 검색어에 따라 리스트 필터링 (REQ-SRCH-001 반영)
  const filteredCerts = certifications.filter(cert =>
    cert.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // [1단계] 종목 검색 및 선택 화면
  if (!isStarted) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#EAECEF] p-10 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-4 flex justify-center items-center">
              <Cpu className="mr-3 text-[#3478B8]" /> AI 학습 종목 검색
            </h2>
            <p className="text-gray-400 font-medium">학습하고자 하는 자격증 명칭을 검색합니다.</p>
          </div>

          {/* 검색 바 섹션 (보강된 부분) */}
          <div className="relative mb-10 group">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="자격증 명칭을 입력합니다 (예: 정보처리, SQL...)" 
              className="w-full bg-white border-2 border-transparent p-6 pl-14 rounded-[24px] shadow-xl shadow-gray-200/50 focus:border-[#3478B8] outline-none transition-all text-lg font-medium"
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#3478B8] transition-colors" size={24} />
          </div>
          
          {/* 필터링된 자격증 리스트 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[400px] overflow-y-auto p-2">
            {filteredCerts.length > 0 ? (
              filteredCerts.map((cert) => (
                <div 
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className={`p-6 rounded-[28px] border-2 transition-all cursor-pointer bg-white shadow-sm ${
                    selectedCert?.id === cert.id ? 'border-[#3478B8] bg-[#3478B8]/5' : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                    selectedCert?.id === cert.id ? 'bg-[#3478B8] text-white' : 'bg-gray-50 text-gray-400'
                  }`}>
                    <BookOpen size={20} />
                  </div>
                  <span className="text-[9px] font-black text-[#3BAA7D] uppercase tracking-tighter">{cert.category}</span>
                  <h4 className="text-base font-black mt-1 text-[#4A4F58]">{cert.name}</h4>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-gray-400 font-bold">
                검색 결과가 없습니다. 다시 입력해 주십시오.
              </div>
            )}
          </div>

          <button 
            disabled={!selectedCert}
            onClick={() => setIsStarted(true)}
            className={`w-full mt-12 py-5 rounded-[24px] font-black text-lg shadow-xl transition-all transform active:scale-[0.98] ${
              selectedCert ? 'bg-[#3478B8] text-white shadow-[#3478B8]/20' : 'bg-gray-300 text-white cursor-not-allowed'
            }`}
          >
            {selectedCert ? `"${selectedCert.name}" 학습 시작` : "종목을 선택해 주십시오"}
          </button>
        </div>
      </div>
    );
  }

  // [2단계] CBT 시험 화면 (선택된 자격증 기반)
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#1a202c] text-white p-10">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsStarted(false)} className="p-2 hover:bg-slate-800 rounded-full transition">
              <RotateCcw size={20} />
            </button>
            <h2 className="text-2xl font-black">{selectedCert.name} 모의고사</h2>
          </div>
          <div className="bg-slate-800 px-6 py-2 rounded-xl border border-slate-700 flex items-center space-x-3 text-[#D9A23A] font-mono text-xl">
            <Timer size={20} /> <span>19:45</span>
          </div>
        </header>

        <div className="bg-[#2d3748] p-10 rounded-[32px] border border-[#4a5568] shadow-2xl mb-8">
          <div className="mb-10">
            <span className="text-[#3478B8] font-bold text-xs uppercase tracking-widest">Question 01</span>
            <h3 className="text-xl font-bold mt-3 leading-relaxed">
              정보처리 산업기사 자격 취득을 위해 필요한 '제1정규형(1NF)'의 핵심 조건은 무엇입니까? 
            </h3>
          </div>
          
          <div className="space-y-4">
            <Option text="1. 모든 컬럼이 원자값(Atomic Value)을 가져야 합니다." isCorrect={true} isGraded={isGraded} />
            <Option text="2. 기본키의 부분 함수 종속성을 제거해야 합니다." isCorrect={false} isGraded={isGraded} />
            <Option text="3. 중복된 데이터를 모두 허용해야 합니다." isCorrect={false} isGraded={isGraded} />
          </div>
        </div>

        <button 
          onClick={() => setIsGraded(true)}
          className="w-full bg-[#3478B8] py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-[#2e69a3] transition"
        >
          {isGraded ? "결과 분석 리포트 확인" : "정답 제출 및 채점"}
        </button>
      </div>
    </div>
  );
};

// 재사용 옵션 컴포넌트
const Option = ({ text, isCorrect, isGraded }) => (
  <button className={`w-full p-6 text-left rounded-2xl transition border-2 flex justify-between items-center ${
    isGraded 
      ? (isCorrect ? 'bg-[#3BAA7D]/10 border-[#3BAA7D] text-[#3BAA7D]' : 'bg-red-500/5 border-red-500/20 text-gray-500') 
      : 'bg-[#374151] border-transparent hover:border-[#3478B8]'
  }`}>
    <span className="font-medium">{text}</span>
    {isGraded && (isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />)}
  </button>
);

export default Study;