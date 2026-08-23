import React, { useState, useEffect } from 'react';
import { Cpu, Timer, CheckCircle, XCircle, Search, BookOpen, RotateCcw, Loader2, Star, ChevronLeft, ChevronRight, Repeat } from 'lucide-react';
import api from '../api/axios';

const CERT_TIME_LIMIT_SEC = 60 * 60; // 60분

const Study = () => {
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [selectedCert, setSelectedCert] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [mode, setMode] = useState(null); // 'exam'(모의고사) | 'practice'(한 문제씩 풀기)

  const [certifications, setCertifications] = useState([]);
  const [isCertsLoading, setIsCertsLoading] = useState(true);
  const [certsError, setCertsError] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // learnId -> 선택한 보기 텍스트
  const [importantIds, setImportantIds] = useState(new Set()); // 중요 표시한 learnId 모음
  const [results, setResults] = useState(null); // 서버 채점 결과 (제출 후 채워짐)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [remainingSec, setRemainingSec] = useState(CERT_TIME_LIMIT_SEC);

  // 한 문제씩 풀기(무한 학습) 모드 상태: 한 문제 -> 즉시 채점/해설 -> 다음 문제를 반복한다
  const [practiceQuestion, setPracticeQuestion] = useState(null);
  const [practiceResult, setPracticeResult] = useState(null); // 방금 푼 문제의 채점 결과
  const [seenLearnIds, setSeenLearnIds] = useState([]); // 최근에 푼 문제 id (연속 중복 방지용)
  const [practiceStats, setPracticeStats] = useState({ solved: 0, correct: 0 });
  const [isPracticeLoading, setIsPracticeLoading] = useState(false);
  const [practiceError, setPracticeError] = useState(null); // 문제 로딩 실패
  const [isPracticeSubmitting, setIsPracticeSubmitting] = useState(false);
  const [practiceSubmitError, setPracticeSubmitError] = useState(null); // 채점 제출 실패
  const [isPracticeImportant, setIsPracticeImportant] = useState(false);

  // 자격증 목록: 백엔드 CERTIFICATION 테이블에서 조회
  useEffect(() => {
    setIsCertsLoading(true);
    setCertsError(null);
    api.get('/certifications')
      .then(res => setCertifications(res.data || []))
      .catch(() => setCertsError("자격증 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."))
      .finally(() => setIsCertsLoading(false));
  }, []);

  // 검색어에 따라 리스트 필터링 (REQ-SRCH-001 반영)
  const filteredCerts = certifications.filter(cert =>
    cert.certName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 시험 시작: 백엔드에서 모의고사 문제 세트를 가져온다 (정답/해설은 포함되지 않음)
  useEffect(() => {
    if (!isStarted || !selectedCert || mode !== 'exam') return;

    setIsLoading(true);
    setLoadError(null);
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers({});
    setImportantIds(new Set());
    setResults(null);
    setSubmitError(null);
    setRemainingSec(CERT_TIME_LIMIT_SEC);

    api.get(`/exams/${selectedCert.certId}/mock`)
      .then(res => setQuestions(res.data || []))
      .catch(() => setLoadError("문제를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."))
      .finally(() => setIsLoading(false));
  }, [isStarted, selectedCert, mode]);

  // 한 문제씩 풀기 모드: 랜덤 1문제를 가져온다 (직전에 풀었던 문제는 제외)
  const fetchPracticeQuestion = (excludeList) => {
    setIsPracticeLoading(true);
    setPracticeError(null);
    setPracticeSubmitError(null);
    setPracticeResult(null);
    setIsPracticeImportant(false);

    const excludeIds = excludeList.slice(-10).join(',');
    api.get(`/exams/${selectedCert.certId}/practice`, excludeIds ? { params: { excludeIds } } : {})
      .then(res => {
        if (!res.data || !res.data.learnId) {
          setPracticeQuestion(null);
          setPracticeError("등록된 문제가 없습니다.");
          return;
        }
        setPracticeQuestion(res.data);
      })
      .catch(() => setPracticeError("문제를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."))
      .finally(() => setIsPracticeLoading(false));
  };

  // 한 문제씩 풀기 시작: 통계 초기화 후 첫 문제를 가져온다
  useEffect(() => {
    if (!isStarted || !selectedCert || mode !== 'practice') return;

    setSeenLearnIds([]);
    setPracticeStats({ solved: 0, correct: 0 });
    fetchPracticeQuestion([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStarted, selectedCert, mode]);

  // 남은 시간 카운트다운, 0이 되면 자동 제출
  useEffect(() => {
    if (!isStarted || isLoading || results || questions.length === 0) return;

    if (remainingSec <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setRemainingSec(prev => prev - 1), 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStarted, isLoading, results, questions.length, remainingSec]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const parseOptions = (raw) => {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (learnId, optionText) => {
    if (results) return;
    setAnswers(prev => ({ ...prev, [learnId]: optionText }));
  };

  // 보기를 더블클릭하면 답안으로 확정하고 곧바로 다음 문제로 이동한다 (CBT 프로그램 관행)
  const handleConfirmOption = (learnId, optionText) => {
    if (results) return;
    setAnswers(prev => ({ ...prev, [learnId]: optionText }));
    setCurrentIndex(i => Math.min(questions.length - 1, i + 1));
  };

  const toggleImportant = (learnId) => {
    if (results) return;
    setImportantIds(prev => {
      const next = new Set(prev);
      if (next.has(learnId)) next.delete(learnId);
      else next.add(learnId);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (isSubmitting || results) return;
    setIsSubmitting(true);
    setSubmitError(null);

    const submissions = questions.map(q => ({
      learnId: q.learnId,
      userAnswer: answers[q.learnId] ?? "",
      isImportant: importantIds.has(q.learnId),
    }));

    try {
      // 채점은 서버에서 수행한다 (정답은 제출 전까지 클라이언트에 내려오지 않음)
      const res = await api.post('/exams/history', submissions);
      setResults(res.data || []);
    } catch {
      setSubmitError("채점 결과를 받아오지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 한 문제씩 풀기: 보기를 클릭하면 그 자리에서 바로 채점하고 해설을 보여준다
  const handlePracticeSelect = async (optionText) => {
    if (isPracticeSubmitting || practiceResult || !practiceQuestion) return;
    setIsPracticeSubmitting(true);
    setPracticeSubmitError(null);

    try {
      const res = await api.post('/exams/history', [{
        learnId: practiceQuestion.learnId,
        userAnswer: optionText,
        isImportant: isPracticeImportant,
      }]);
      const graded = (res.data || [])[0] ?? null;
      setPracticeResult(graded);
      if (graded) {
        setPracticeStats(prev => ({
          solved: prev.solved + 1,
          correct: prev.correct + (graded.isCorrect ? 1 : 0),
        }));
      }
    } catch {
      setPracticeSubmitError("채점 결과를 받아오지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsPracticeSubmitting(false);
    }
  };

  const togglePracticeImportant = () => {
    if (practiceResult) return; // 이미 채점/저장된 문제는 변경할 수 없다
    setIsPracticeImportant(prev => !prev);
  };

  // 다음 문제로: 방금 푼 문제를 제외 목록에 넣고 새 랜덤 문제를 가져온다
  const handleNextPractice = () => {
    if (!practiceQuestion) return;
    const nextSeen = [...seenLearnIds, practiceQuestion.learnId].slice(-10);
    setSeenLearnIds(nextSeen);
    fetchPracticeQuestion(nextSeen);
  };

  const resetToSelection = () => {
    setIsStarted(false);
    setSelectedCert(null);
    setMode(null);
    setQuestions([]);
    setResults(null);
    setPracticeQuestion(null);
    setPracticeResult(null);
    setSeenLearnIds([]);
    setPracticeStats({ solved: 0, correct: 0 });
    setPracticeError(null);
    setPracticeSubmitError(null);
  };

  const correctCount = results ? results.filter(r => r.isCorrect).length : 0;
  const scorePercent = results && results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;

  // [1단계] 종목 검색 및 선택 화면 (라이트 타일 + 선택 시 뜨는 하단 플로팅 바)
  if (!isStarted) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#EAECEF] px-6 py-16">
        <div className={`max-w-4xl mx-auto ${selectedCert ? 'pb-28' : ''}`}>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold tracking-tight mb-3 flex justify-center items-center text-[#1d1d1f]">
              <Cpu className="mr-3 text-[#3478B8]" strokeWidth={2.25} /> AI 학습 종목 검색
            </h2>
            <p className="text-[17px] text-gray-500">학습하고자 하는 자격증 명칭을 검색합니다.</p>
          </div>

          {/* 검색 바 */}
          <div className="relative mb-10 group max-w-xl mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="자격증 명칭을 입력합니다 (예: 정보처리, SQL...)"
              className="w-full bg-white border border-gray-200 py-4 pl-14 pr-5 rounded-full focus:border-[#3478B8] outline-none transition-colors text-[16px]"
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#3478B8] transition-colors" size={18} />
          </div>

          {/* 자격증 리스트: 선택형 로우 카드 (체크 표시로 선택 상태 표현) */}
          {isCertsLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400 space-y-3">
              <Loader2 className="animate-spin text-[#3478B8]" size={30} />
              <span className="text-[15px] font-medium">자격증 목록을 불러오는 중입니다...</span>
            </div>
          ) : certsError ? (
            <div className="py-20 text-center text-gray-400 font-medium">{certsError}</div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-2 max-h-[440px] overflow-y-auto p-1">
              {filteredCerts.length > 0 ? (
                filteredCerts.map((cert) => {
                  const isSelected = selectedCert?.certId === cert.certId;
                  return (
                    <div
                      key={cert.certId}
                      onClick={() => setSelectedCert(cert)}
                      className={`flex items-center gap-4 p-4 rounded-[18px] cursor-pointer transition-colors ${
                        isSelected ? 'bg-white ring-1 ring-inset ring-[#3478B8]' : 'bg-white hover:bg-white/60'
                      }`}
                    >
                      <div className={`w-11 h-11 flex-shrink-0 rounded-[11px] flex items-center justify-center ${
                        isSelected ? 'bg-[#3478B8] text-white' : 'bg-gray-50 text-gray-400'
                      }`}>
                        <BookOpen size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-semibold text-[#3BAA7D] uppercase tracking-wide">{cert.agency}</span>
                        <h4 className="text-[16px] font-semibold text-[#1d1d1f] tracking-tight truncate">{cert.certName}</h4>
                      </div>
                      {cert.difficulty && (
                        <span className="flex-shrink-0 text-[12px] text-gray-400">난이도 {cert.difficulty}</span>
                      )}
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-[#3478B8] text-white' : 'bg-transparent'
                      }`}>
                        {isSelected && <CheckCircle size={20} className="text-[#3478B8]" />}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-20 text-center text-gray-400 font-medium">
                  검색 결과가 없습니다. 다시 입력해 주십시오.
                </div>
              )}
            </div>
          )}
        </div>

        {/* 선택 시에만 떠오르는 하단 플로팅 바 (Apple의 floating-sticky-bar 패턴) */}
        {selectedCert && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur border-t border-gray-200">
            <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[12px] text-gray-400">선택된 종목</p>
                <p className="text-[16px] font-semibold text-[#1d1d1f] truncate">{selectedCert.certName}</p>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2.5">
                <button
                  onClick={() => { setMode('practice'); setIsStarted(true); }}
                  className="px-6 py-3.5 rounded-full font-semibold text-[15px] bg-white border border-[#3478B8] text-[#3478B8] hover:bg-[#3478B8]/5 transition active:scale-[0.97] flex items-center gap-1.5"
                >
                  <Repeat size={15} /> 한 문제씩 풀기
                </button>
                <button
                  onClick={() => { setMode('exam'); setIsStarted(true); }}
                  className="px-8 py-3.5 rounded-full font-semibold text-[15px] bg-[#3478B8] text-white shadow-md shadow-[#3478B8]/25 hover:bg-[#2e69a3] transition active:scale-[0.97]"
                >
                  모의고사 시작
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // [한 문제씩 풀기 모드] 문제 1개 -> 즉시 채점/해설 -> 다음 문제를 무한 반복
  if (mode === 'practice') {
    const practiceOptions = practiceQuestion ? parseOptions(practiceQuestion.options) : [];
    const accuracy = practiceStats.solved > 0 ? Math.round((practiceStats.correct / practiceStats.solved) * 100) : 0;

    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#EAECEF] text-[#1d1d1f] px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <header className="flex items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={resetToSelection} className="p-2 hover:bg-white rounded-full transition-colors flex-shrink-0">
                <RotateCcw size={18} />
              </button>
              <div className="min-w-0">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#3478B8] uppercase tracking-wide">
                  <Repeat size={12} /> 한 문제씩 풀기
                </span>
                <h2 className="text-xl font-semibold tracking-tight truncate">{selectedCert.certName}</h2>
              </div>
            </div>
            <div className="flex-shrink-0 bg-white px-5 py-2 rounded-full border border-gray-200 text-[13px] font-medium text-gray-500 whitespace-nowrap">
              {practiceStats.solved}문제 풀이 · 정답률 <span className="text-[#3BAA7D] font-semibold">{accuracy}%</span>
            </div>
          </header>

          {isPracticeLoading ? (
            <div className="py-24 flex flex-col items-center justify-center text-gray-400 space-y-3">
              <Loader2 className="animate-spin text-[#3478B8]" size={30} />
              <span className="text-[15px] font-medium">문제를 불러오는 중입니다...</span>
            </div>
          ) : practiceError || !practiceQuestion ? (
            <div className="py-24 flex flex-col items-center justify-center text-center space-y-5">
              <p className="text-[15px] font-medium text-gray-500">{practiceError || "등록된 문제가 없습니다."}</p>
              <button
                onClick={() => fetchPracticeQuestion(seenLearnIds)}
                className="flex items-center px-6 py-3 bg-white border border-gray-200 rounded-full text-[15px] font-medium hover:bg-gray-50 transition-colors"
              >
                <RotateCcw size={16} className="mr-2" /> 다시 시도
              </button>
            </div>
          ) : (
            <div className="bg-white p-9 rounded-[18px] border border-gray-200">
              <div className="mb-8 flex items-center justify-between">
                <span className="text-[#3478B8] font-semibold text-xs uppercase tracking-wide">
                  Question {String(practiceStats.solved + 1).padStart(2, '0')}
                </span>
                <button
                  type="button"
                  onClick={togglePracticeImportant}
                  disabled={Boolean(practiceResult)}
                  title="중요 문제로 표시 (오답노트에 표시됩니다)"
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors disabled:opacity-60 ${
                    isPracticeImportant ? 'bg-[#D9A23A]/10 text-[#D9A23A]' : 'bg-transparent text-gray-400 hover:text-[#D9A23A]'
                  }`}
                >
                  <Star size={12} className={isPracticeImportant ? 'fill-[#D9A23A]' : ''} /> 중요
                </button>
              </div>

              <h3 className="text-[19px] font-semibold mb-8 leading-relaxed tracking-tight">
                {practiceQuestion.question}
              </h3>

              <div className="space-y-3">
                {practiceOptions.map((opt, i) => (
                  practiceResult ? (
                    <Option
                      key={i}
                      text={opt}
                      isCorrect={opt === practiceResult.correctAnswer}
                      isUserPick={opt === practiceResult.userAnswer}
                      isGraded={true}
                    />
                  ) : (
                    <button
                      key={i}
                      type="button"
                      disabled={isPracticeSubmitting}
                      onClick={() => handlePracticeSelect(opt)}
                      className="w-full p-5 text-left rounded-[11px] bg-[#F5F5F7] hover:bg-gray-200/70 transition-colors disabled:opacity-60"
                    >
                      <span className="text-[15px] font-medium">{opt}</span>
                    </button>
                  )
                ))}
              </div>

              {practiceResult && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <div className={`flex items-center gap-2 font-semibold text-[15px] mb-3 ${
                    practiceResult.isCorrect ? 'text-[#3BAA7D]' : 'text-red-500'
                  }`}>
                    {practiceResult.isCorrect ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    {practiceResult.isCorrect ? '정답입니다' : '오답입니다'}
                  </div>
                  {practiceResult.explanation && (
                    <p className="text-[14px] text-gray-500 leading-relaxed">{practiceResult.explanation}</p>
                  )}
                  <button
                    onClick={handleNextPractice}
                    className="w-full mt-8 py-4 rounded-full font-semibold text-[17px] bg-[#3478B8] text-white shadow-md shadow-[#3478B8]/25 hover:bg-[#2e69a3] transition active:scale-[0.97] flex items-center justify-center gap-2"
                  >
                    다음 문제 <ChevronRight size={18} />
                  </button>
                </div>
              )}

              {practiceSubmitError && (
                <div className="mt-6 p-4 rounded-[11px] bg-red-50 text-red-600 text-[14px] font-medium">
                  {practiceSubmitError}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // [2단계] 문제 로딩 중 (모의고사)
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#EAECEF] text-[#1d1d1f] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-[#3478B8]" size={36} />
        <p className="text-[15px] font-medium text-gray-500">{selectedCert.certName} 모의고사를 준비하고 있습니다...</p>
      </div>
    );
  }

  // [2-1단계] 문제 로딩 실패 / 문제 없음
  if (loadError || questions.length === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#EAECEF] text-[#1d1d1f] flex flex-col items-center justify-center space-y-6">
        <p className="text-[15px] font-medium text-gray-500">{loadError || "등록된 문제가 없습니다."}</p>
        <button onClick={resetToSelection} className="flex items-center px-6 py-3 bg-white border border-gray-200 rounded-full text-[15px] font-medium hover:bg-gray-50 transition-colors">
          <RotateCcw size={16} className="mr-2" /> 종목 다시 선택
        </button>
      </div>
    );
  }

  // [3단계] 채점 결과 리포트 (상단에 점수 히어로 → 문항별 리스트)
  if (results) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#EAECEF] text-[#1d1d1f] px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <button onClick={resetToSelection} className="flex items-center text-gray-400 hover:text-[#3478B8] text-[14px] font-medium mb-8 transition-colors">
            <RotateCcw size={15} className="mr-2" /> 종목 다시 선택
          </button>

          {/* 점수 히어로 */}
          <div className="text-center mb-14">
            <p className="text-[15px] text-gray-500 mb-2">{selectedCert.certName} 결과</p>
            <div className="text-7xl font-semibold tracking-tight text-[#3BAA7D]">{scorePercent}<span className="text-3xl align-top ml-1">%</span></div>
            <p className="text-[17px] text-gray-500 mt-3">{results.length}문제 중 <span className="font-semibold text-[#1d1d1f]">{correctCount}개</span> 정답</p>
          </div>

          <div className="space-y-6">
            {results.map((r, idx) => {
              const options = parseOptions(r.options);
              return (
                <div key={r.learnId} className="bg-white p-7 rounded-[18px] border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[#3478B8] font-semibold text-xs uppercase tracking-wide">Question {String(idx + 1).padStart(2, '0')}</span>
                    {r.isImportant && (
                      <span className="flex items-center text-[#D9A23A] text-xs font-semibold">
                        <Star size={14} className="mr-1 fill-[#D9A23A]" /> 중요 표시
                      </span>
                    )}
                  </div>
                  <h3 className="text-[17px] font-semibold mt-2 mb-5 leading-relaxed text-[#1d1d1f]">{r.question}</h3>
                  <div className="space-y-2.5">
                    {options.map((opt, i) => (
                      <Option
                        key={i}
                        text={opt}
                        isCorrect={opt === r.correctAnswer}
                        isUserPick={opt === r.userAnswer}
                        isGraded={true}
                      />
                    ))}
                  </div>
                  {r.explanation && (
                    <p className="mt-5 text-[14px] text-gray-500 leading-relaxed">{r.explanation}</p>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={resetToSelection}
            className="w-full mt-10 py-4 rounded-full font-semibold text-[17px] bg-[#3478B8] text-white shadow-md shadow-[#3478B8]/25 hover:bg-[#2e69a3] transition active:scale-[0.97]"
          >
            다른 종목 학습하기
          </button>
        </div>
      </div>
    );
  }

  // [2단계] CBT 시험 화면 — 상단 진행률 바 + 하단 플로팅 네비게이션 바 (아이콘 이전/다음 + 상시 제출 CTA)
  const options = parseOptions(currentQuestion.options);
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);
  const isLast = currentIndex === questions.length - 1;
  const isFirst = currentIndex === 0;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#EAECEF] text-[#1d1d1f]">
      {/* 상단 진행률 바 */}
      <div className="h-1 bg-gray-200">
        <div className="h-full bg-[#3478B8] transition-all duration-300" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 pb-28">
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center space-x-4">
            <button onClick={resetToSelection} className="p-2 hover:bg-white rounded-full transition-colors">
              <RotateCcw size={18} />
            </button>
            <h2 className="text-2xl font-semibold tracking-tight">{selectedCert.certName} 모의고사</h2>
          </div>
          <div className="bg-white px-5 py-2 rounded-full border border-gray-200 flex items-center space-x-2 text-[#D9A23A] font-mono text-lg">
            <Timer size={18} /> <span>{formatTime(remainingSec)}</span>
          </div>
        </header>

        {submitError && (
          <div className="mb-6 p-4 rounded-[11px] bg-red-50 text-red-600 text-[14px] font-medium">
            {submitError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
          <div className="bg-white p-9 rounded-[18px] border border-gray-200">
            <div className="mb-8 flex items-center gap-3">
              <span className="text-[#3478B8] font-semibold text-xs uppercase tracking-wide">
                Question {String(currentIndex + 1).padStart(2, '0')} / {questions.length}
              </span>
              <button
                type="button"
                onClick={() => toggleImportant(currentQuestion.learnId)}
                title="중요 문제로 표시 (오답노트에 표시됩니다)"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                  importantIds.has(currentQuestion.learnId)
                    ? 'bg-[#D9A23A]/10 text-[#D9A23A]'
                    : 'bg-transparent text-gray-400 hover:text-[#D9A23A]'
                }`}
              >
                <Star size={12} className={importantIds.has(currentQuestion.learnId) ? 'fill-[#D9A23A]' : ''} /> 중요
              </button>
            </div>
            <h3 className="text-[19px] font-semibold mb-8 leading-relaxed tracking-tight">
              {currentQuestion.question}
            </h3>

            <div className="space-y-3">
              {options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectOption(currentQuestion.learnId, opt)}
                  onDoubleClick={() => handleConfirmOption(currentQuestion.learnId, opt)}
                  className={`w-full p-5 text-left rounded-[11px] transition-colors ${
                    answers[currentQuestion.learnId] === opt
                      ? 'bg-[#3478B8]/10 text-[#1d1d1f] ring-1 ring-inset ring-[#3478B8]'
                      : 'bg-[#F5F5F7] hover:bg-gray-200/70'
                  }`}
                >
                  <span className="text-[15px] font-medium">{opt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 답안 표기란: 문제 번호별로 풀이 여부를 한눈에 보고, 클릭하면 바로 그 문제로 이동 */}
          <div className="hidden lg:block bg-white p-5 rounded-[18px] border border-gray-200 lg:sticky lg:top-6">
            <h4 className="text-[13px] font-semibold text-gray-500 mb-4">답안 표기란</h4>
            <div className="grid grid-cols-5 gap-2 max-h-[420px] overflow-y-auto pr-1">
              {questions.map((q, i) => {
                const isAnswered = Boolean(answers[q.learnId]);
                const isCurrent = i === currentIndex;
                return (
                  <button
                    key={q.learnId}
                    type="button"
                    onClick={() => setCurrentIndex(i)}
                    className={`relative aspect-square rounded-[8px] text-[12px] font-semibold transition-colors ${
                      isAnswered
                        ? 'bg-[#3478B8] text-white'
                        : 'bg-[#F5F5F7] text-gray-500 hover:bg-gray-200'
                    } ${isCurrent ? 'ring-2 ring-offset-1 ring-[#3478B8]' : ''}`}
                  >
                    {i + 1}
                    {importantIds.has(q.learnId) && (
                      <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-[#D9A23A]" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-[12px] text-gray-500">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-[4px] bg-[#3478B8]" /> 답안 표기 완료</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-[4px] bg-[#F5F5F7] border border-gray-200" /> 미표기</div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#D9A23A] ml-[3px] mr-[3px]" /> 중요 표시</div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 플로팅 바: 아이콘 이전/다음 네비게이션 + 상시 노출되는 제출 CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              disabled={isFirst}
              onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-[#F5F5F7] text-[#1d1d1f] disabled:opacity-30 hover:bg-gray-200 transition active:scale-[0.95]"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              disabled={isLast}
              onClick={() => setCurrentIndex(i => Math.min(questions.length - 1, i + 1))}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-[#F5F5F7] text-[#1d1d1f] disabled:opacity-30 hover:bg-gray-200 transition active:scale-[0.95]"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* 마지막 문제가 아니어도 언제든 바로 제출/채점할 수 있다 */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-10 py-3.5 rounded-full font-semibold text-[15px] bg-[#3478B8] text-white shadow-md shadow-[#3478B8]/25 hover:bg-[#2e69a3] transition active:scale-[0.97] disabled:opacity-60"
          >
            {isSubmitting ? "채점 중..." : "정답 제출 및 채점"}
          </button>
        </div>
      </div>
    </div>
  );
};

// 재사용 옵션 컴포넌트 (결과 리포트 화면용)
const Option = ({ text, isCorrect, isUserPick, isGraded }) => (
  <div className={`w-full p-5 rounded-[11px] flex justify-between items-center ${
    isGraded && isCorrect
      ? 'bg-[#3BAA7D]/10 text-[#3BAA7D]'
      : isGraded && isUserPick
        ? 'bg-red-50 text-red-500'
        : 'bg-[#F5F5F7] text-gray-500'
  }`}>
    <span className="text-[15px] font-medium">{text}</span>
    {isGraded && isCorrect && <CheckCircle size={18} />}
    {isGraded && !isCorrect && isUserPick && <XCircle size={18} />}
  </div>
);

export default Study;
