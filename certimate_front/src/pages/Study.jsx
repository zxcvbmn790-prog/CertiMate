import React, { useState, useEffect } from 'react';
import { Cpu, Timer, CheckCircle, XCircle, Search, BookOpen, RotateCcw, ChevronLeft, ChevronRight, Check } from 'lucide-react';

const Study = () => {
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedCert, setSelectedCert] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isGraded, setIsGraded] = useState(false);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({}); 
  const [isLoading, setIsLoading] = useState(false);

  // [기능 추가] 타이머 상태 (90분 = 5400초)
  const [timeLeft, setTimeLeft] = useState(5400);

  const certifications = [
    { id: 1, name: "정보처리산업기사", category: "국가기술", questions: 60 },
    { id: 2, name: "SQLD (개발자)", category: "민간자격", questions: 50 },
    { id: 3, name: "리눅스마스터 2급", category: "국가기술", questions: 80 },
    { id: 4, name: "네트워크관리사 2급", category: "민간자격", questions: 50 },
    { id: 5, name: "데이터분석준전문가(ADsP)", category: "민간자격", questions: 50 }
  ];

  const filteredCerts = certifications.filter(cert =>
    cert.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // [기능 추가] 타이머 카운트다운 로직
  useEffect(() => {
    if (isStarted && !isGraded && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isGraded) {
      alert("시험 시간이 종료되어 자동으로 답안이 제출됩니다.");
      submitExam();
    }
  }, [isStarted, isGraded, timeLeft]);

  // 초를 MM:SS 형식으로 변환
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startExam = async () => {
    if (!selectedCert) return;
    setIsLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8080/api/exams/${selectedCert.id}/mock`);
      const data = await response.json();
      
      const parsedData = data.map(q => ({
        ...q,
        optionsArray: JSON.parse(q.options)
      }));
      
      setQuestions(parsedData);
      setIsStarted(true);
      setIsGraded(false);
      setUserAnswers({});
      setCurrentIndex(0);
      setTimeLeft(5400); // 90분 초기화
    } catch (error) {
      console.error("문제 로딩 실패:", error);
      alert("백엔드 서버와 연결할 수 없습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnswer = (learnId, value) => {
    if (isGraded) return; 
    setUserAnswers(prev => ({ ...prev, [learnId]: value }));
    
    // 답을 고르면 자동으로 다음 문제로 넘어가는 기능 (원치 않으시면 삭제 무방)
    if (currentIndex < questions.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
    }
  };

  const submitExam = async () => {
    if (isGraded) return;

    if (Object.keys(userAnswers).length < questions.length && timeLeft > 0) {
      if (!window.confirm(`아직 풀지 않은 문제가 있습니다. (${Object.keys(userAnswers).length}/${questions.length})\n그래도 제출하시겠습니까?`)) return;
    }

    setIsGraded(true);
    setCurrentIndex(0); // 채점 후 1번 문제로

    const historyPayload = questions.map(q => {
      const uAnswer = userAnswers[q.learnId] || ""; 
      const correct = String(uAnswer) === String(q.answer);
      return {
        learnId: q.learnId,
        userAnswer: uAnswer,
        isCorrect: correct
      };
    });

    try {
      await fetch('http://localhost:8080/api/exams/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(historyPayload)
      });
      alert("수고하셨습니다! 결과가 오답노트에 저장되었습니다.");
    } catch (error) {
      console.error("오답노트 저장 실패:", error);
    }
  };

  const goToNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const goToPrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  // ---------------- 화면 렌더링 ----------------

  if (!isStarted) {
    // 1단계 검색 화면 (이전과 동일)
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#EAECEF] p-10 flex items-center justify-center">
        {/* 기존 검색 UI 그대로 유지 */}
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-4 flex justify-center items-center">
              <Cpu className="mr-3 text-[#3478B8]" /> AI 학습 종목 검색
            </h2>
            <p className="text-gray-400 font-medium">학습하고자 하는 자격증 명칭을 검색합니다.</p>
          </div>

          <div className="relative mb-10 group">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="자격증 명칭을 입력합니다 (예: 정보처리, SQL...)" 
              className="w-full bg-white border-2 border-transparent p-6 pl-14 rounded-[24px] shadow-xl shadow-gray-200/50 focus:border-[#3478B8] outline-none transition-all text-lg font-medium"
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#3478B8]" size={24} />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[400px] overflow-y-auto p-2">
            {filteredCerts.map((cert) => (
              <div 
                key={cert.id}
                onClick={() => setSelectedCert(cert)}
                className={`p-6 rounded-[28px] border-2 transition-all cursor-pointer bg-white shadow-sm ${selectedCert?.id === cert.id ? 'border-[#3478B8] bg-[#3478B8]/5' : 'border-transparent hover:border-gray-200'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${selectedCert?.id === cert.id ? 'bg-[#3478B8] text-white' : 'bg-gray-50 text-gray-400'}`}>
                  <BookOpen size={20} />
                </div>
                <span className="text-[9px] font-black text-[#3BAA7D] uppercase tracking-tighter">{cert.category}</span>
                <h4 className="text-base font-black mt-1 text-[#4A4F58]">{cert.name}</h4>
              </div>
            ))}
          </div>

          <button 
            disabled={!selectedCert || isLoading}
            onClick={startExam}
            className={`w-full mt-12 py-5 rounded-[24px] font-black text-lg shadow-xl transition-all ${selectedCert ? 'bg-[#3478B8] text-white shadow-[#3478B8]/20' : 'bg-gray-300 text-white cursor-not-allowed'}`}
          >
            {isLoading ? "시험지 준비 중..." : (selectedCert ? `"${selectedCert.name}" 학습 시작` : "종목을 선택해 주십시오")}
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentIndex];

  // 2단계 CBT 화면 (좌측 문제, 우측 OMR)
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#1a202c] text-white p-6 md:p-10 flex flex-col md:flex-row gap-8">
      
      {/* 🟢 좌측: 문제 풀이 영역 */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto md:mx-0 w-full">
        <header className="flex items-center space-x-4 mb-8">
          <button onClick={() => { if(window.confirm("시험을 중단하시겠습니까?")) setIsStarted(false) }} className="p-2 hover:bg-slate-800 rounded-full transition text-gray-400">
            <RotateCcw size={20} />
          </button>
          <h2 className="text-2xl font-black">{selectedCert.name} 모의고사</h2>
        </header>

        {/* 진행 바 */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2 font-bold">
            <span>진행률</span>
            <span>{currentIndex + 1} / {questions.length}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div 
              className="bg-[#3478B8] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 문제 카드 */}
        {q && (
          <div className="bg-[#2d3748] p-8 md:p-10 rounded-[32px] border border-[#4a5568] shadow-2xl mb-8 flex-1 flex flex-col">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[#3478B8] font-bold text-sm uppercase tracking-widest bg-[#3478B8]/10 px-4 py-1.5 rounded-full">
                  Question {String(currentIndex + 1).padStart(2, '0')}
                </span>
                {isGraded && (
                  <span className={`font-bold text-sm px-4 py-1.5 rounded-full ${String(userAnswers[q.learnId]) === String(q.answer) ? 'bg-[#3BAA7D]/20 text-[#3BAA7D]' : 'bg-red-500/20 text-red-400'}`}>
                    {String(userAnswers[q.learnId]) === String(q.answer) ? '정답' : '오답'}
                  </span>
                )}
              </div>
              <h3 className="text-xl md:text-2xl font-bold leading-relaxed text-gray-100 break-keep">
                {q.question}
              </h3>
            </div>
            
            <div className="space-y-4 flex-1">
              {q.optionsArray.map((opt, optIdx) => (
                <Option 
                  key={optIdx}
                  text={`${optIdx + 1}. ${opt}`} 
                  isSelected={userAnswers[q.learnId] === String(optIdx + 1)}
                  isActualAnswer={String(q.answer) === String(optIdx + 1)}
                  isGraded={isGraded}
                  onClick={() => handleSelectAnswer(q.learnId, String(optIdx + 1))}
                />
              ))}
            </div>

            {isGraded && q.explanation && (
              <div className="mt-8 p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-gray-300 text-sm leading-relaxed">
                <div className="flex items-center mb-2">
                  <span className="text-[#3BAA7D] font-bold mr-2 text-lg">💡 해설</span>
                </div>
                <p className="text-base whitespace-pre-line">{q.explanation}</p>
              </div>
            )}
          </div>
        )}

        {/* 이전 / 다음 네비게이션 */}
        <div className="flex justify-between items-center space-x-4">
          <button 
            onClick={goToPrev}
            disabled={currentIndex === 0}
            className="flex items-center px-6 py-4 md:py-5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed font-bold"
          >
            <ChevronLeft className="mr-2" /> 이전
          </button>
          <button 
            onClick={goToNext}
            disabled={currentIndex === questions.length - 1}
            className="flex items-center flex-1 justify-center px-6 py-4 md:py-5 bg-[#3478B8]/20 hover:bg-[#3478B8]/30 border border-[#3478B8]/50 text-[#3478B8] rounded-2xl transition font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed"
          >
            다음 <ChevronRight className="ml-2" />
          </button>
        </div>
      </div>

      {/* 🔴 우측: OMR 및 정보 패널 */}
      <div className="w-full md:w-80 lg:w-96 flex flex-col gap-6 shrink-0">
        
        {/* 타이머 카드 */}
        <div className="bg-[#2d3748] rounded-[32px] border border-[#4a5568] p-6 text-center shadow-lg">
          <div className="text-gray-400 font-bold text-sm mb-2 uppercase tracking-widest flex items-center justify-center">
            <Timer size={16} className="mr-2" /> 남은 시간
          </div>
          <div className={`text-4xl font-mono font-black ${timeLeft < 600 ? 'text-red-400' : 'text-[#D9A23A]'}`}>
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* OMR 문항 팔레트 */}
        <div className="bg-[#2d3748] rounded-[32px] border border-[#4a5568] p-6 shadow-lg flex-1 flex flex-col min-h-[300px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">답안 현황</h3>
            <span className="text-sm font-bold bg-slate-800 px-3 py-1 rounded-full text-[#3478B8]">
              {Object.keys(userAnswers).length} / {questions.length}
            </span>
          </div>
          
          <div className="grid grid-cols-5 gap-2 overflow-y-auto pr-2 custom-scrollbar flex-1 content-start">
            {questions.map((question, idx) => {
              const isAnswered = !!userAnswers[question.learnId];
              const isCurrent = currentIndex === idx;
              let btnClass = "bg-slate-700 text-gray-400 border-transparent hover:bg-slate-600"; // 기본 (안풂)

              if (isGraded) {
                const isCorrect = String(userAnswers[question.learnId]) === String(question.answer);
                if (isCorrect) btnClass = "bg-[#3BAA7D]/20 border-[#3BAA7D] text-[#3BAA7D]"; // 정답
                else if (isAnswered) btnClass = "bg-red-500/20 border-red-500/50 text-red-400"; // 오답
                else btnClass = "bg-slate-800 border-slate-600 text-slate-500"; // 미응답
              } else {
                if (isCurrent) btnClass = "bg-[#3478B8] text-white border-[#3478B8] shadow-md shadow-[#3478B8]/30"; // 현재 위치
                else if (isAnswered) btnClass = "bg-[#3478B8]/20 border-[#3478B8]/50 text-[#3478B8]"; // 푼 문제
              }

              return (
                <button
                  key={question.learnId}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-11 rounded-xl text-sm font-bold border-2 transition-all flex items-center justify-center ${btnClass}`}
                >
                  {isAnswered && !isGraded && !isCurrent ? <Check size={14} className="opacity-80" /> : idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* 항시 제출 버튼 */}
        <button 
          onClick={submitExam}
          disabled={isGraded}
          className="w-full bg-[#3BAA7D] hover:bg-[#32966e] text-white py-5 rounded-[24px] transition font-black text-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[#3BAA7D]/20 shrink-0"
        >
          {isGraded ? "채점 완료 (결과 확인중)" : "답안 최종 제출"}
        </button>

      </div>
    </div>
  );
};

// 재사용 가능한 옵션 컴포넌트
const Option = ({ text, isSelected, isActualAnswer, isGraded, onClick }) => {
  let btnClass = 'bg-[#374151] border-transparent hover:border-[#3478B8] text-white';

  if (isGraded) {
    if (isActualAnswer) {
      btnClass = 'bg-[#3BAA7D]/15 border-[#3BAA7D] text-[#3BAA7D] shadow-sm shadow-[#3BAA7D]/10'; 
    } else if (isSelected && !isActualAnswer) {
      btnClass = 'bg-red-500/10 border-red-500/30 text-red-400'; 
    } else {
      btnClass = 'bg-[#374151] border-transparent text-gray-500 opacity-50'; 
    }
  } else if (isSelected) {
    btnClass = 'border-[#3478B8] bg-[#3478B8]/20 text-[#3478B8] shadow-sm shadow-[#3478B8]/10'; 
  }

  return (
    <button 
      onClick={onClick}
      disabled={isGraded}
      className={`w-full p-4 md:p-5 text-left rounded-2xl transition-all border-2 flex justify-between items-center ${btnClass}`}
    >
      <span className="font-medium text-[15px]">{text}</span>
      {isGraded && isActualAnswer && <CheckCircle size={22} className="shrink-0 ml-4" />}
      {isGraded && isSelected && !isActualAnswer && <XCircle size={22} className="shrink-0 ml-4" />}
    </button>
  );
};

export default Study;