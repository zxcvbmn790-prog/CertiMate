import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalIcon, MapPin, Navigation, 
  Search, ChevronLeft, ChevronRight, 
  Clock, X
} from 'lucide-react';

const CERTIFICATE_DB = [
  {
    id: 'cert_1',
    name: '정보처리기사',
    events: [
      { id: 'e1', title: '필기 원서접수', date: '2026-05-10', type: 'reg' },
      { id: 'e2', title: '필기 시험일', date: '2026-05-25', type: 'exam' },
    ]
  },
  {
    id: 'cert_2',
    name: '산업안전산업기사',
    events: [
      { id: 'e3', title: '실기 원서접수', date: '2026-05-15', type: 'reg' },
      { id: 'e4', title: '실기 시험일', date: '2026-05-20', type: 'exam' },
    ]
  },
  {
    id: 'cert_3',
    name: '컴퓨터활용능력 1급',
    events: [
      { id: 'e5', title: '정기 시험일', date: '2026-05-05', type: 'exam' },
    ]
  }
];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)); 
  const [selectedCerts, setSelectedCerts] = useState([CERTIFICATE_DB[1]]);
  const [searchQuery, setSearchQuery] = useState('');

  // --- 달력 그리드 계산 로직 ---
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate(); 
  const firstDayOfMonth = new Date(year, month, 1).getDay(); 

  // ★ 핵심: 어떤 달이든 항상 6주(42칸)를 렌더링하여 캘린더 높이/모양을 완벽히 고정
  const TOTAL_CELLS = 42; 
  const trailingEmptyCells = TOTAL_CELLS - (firstDayOfMonth + daysInMonth);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const allSelectedEvents = useMemo(() => {
    return selectedCerts.flatMap(cert => 
      cert.events.map(event => ({ ...event, certName: cert.name }))
    );
  }, [selectedCerts]);

  const getEventsForDate = (day) => {
    const targetDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return allSelectedEvents.filter(event => event.date === targetDateStr);
  };

  const upcomingEvents = useMemo(() => {
    return allSelectedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [allSelectedEvents]);

  const handleAddCert = (cert) => {
    if (!selectedCerts.find(c => c.id === cert.id)) {
      setSelectedCerts([...selectedCerts, cert]);
    }
    setSearchQuery('');
  };

  const handleRemoveCert = (certId) => {
    setSelectedCerts(selectedCerts.filter(c => c.id !== certId));
  };

  return (
    // 전체 컨테이너에 w-full 강제 지정
    <main className="max-w-7xl w-full mx-auto px-6 py-10 bg-[#F8F9FA] min-h-screen font-sans">
      
      <div className="mb-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <CalIcon className="text-[#3478B8]" size={28} />
          <h2 className="text-2xl font-black text-[#4A4F58] tracking-tight">
            나만의 자격증 캘린더
          </h2>
          <span className="hidden md:block text-sm text-gray-400 font-medium ml-2">
            준비 중인 자격증을 검색하고 일정을 한눈에 관리하세요.
          </span>
        </div>

        <div className="w-full md:w-80 relative z-50">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="자격증 검색 (예: 정보처리기사)" 
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-[#3478B8] focus:bg-white transition-all font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {searchQuery && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 shadow-xl rounded-xl p-2">
              {CERTIFICATE_DB.filter(c => c.name.includes(searchQuery)).map(cert => (
                <div 
                  key={cert.id} 
                  onClick={() => handleAddCert(cert)}
                  className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer text-sm font-bold text-[#4A4F58] transition-colors"
                >
                  {cert.name}
                </div>
              ))}
              {CERTIFICATE_DB.filter(c => c.name.includes(searchQuery)).length === 0 && (
                <div className="p-3 text-sm text-gray-400 text-center">검색 결과가 없습니다.</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 min-h-[40px] items-start w-full">
        {selectedCerts.map(cert => (
          <div key={cert.id} className="flex items-center bg-[#3478B8] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
            {cert.name}
            <button onClick={() => handleRemoveCert(cert.id)} className="ml-2 hover:bg-white/20 p-0.5 rounded-full transition-colors">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* ★ 핵심: Grid 컨테이너에도 w-full을 주어 좌우 여백이 무너지지 않게 함 */}
      <div className="grid lg:grid-cols-12 gap-8 w-full">
        
        {/* 1. 메인 캘린더 섹션 (비율 고정) */}
        <div className="lg:col-span-8 w-full min-w-0">
          <div className="bg-white p-8 rounded-[32px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-gray-50 h-full w-full">
            
            <div className="flex items-center mb-8 gap-4">
              <h3 className="text-2xl font-black text-[#4A4F58]">
                {year}년 {month + 1}월
              </h3>
              <div className="flex space-x-1">
                <button onClick={prevMonth} className="p-1 hover:bg-gray-50 rounded-lg transition text-gray-400"><ChevronLeft size={20}/></button>
                <button onClick={nextMonth} className="p-1 hover:bg-gray-50 rounded-lg transition text-gray-400"><ChevronRight size={20}/></button>
              </div>
            </div>

            <div className="grid grid-cols-7 mb-4 w-full">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                <div key={day} className={`text-center text-[10px] font-black uppercase tracking-widest py-2 ${idx === 0 ? 'text-[#FF6B6B]' : idx === 6 ? 'text-[#4DABF7]' : 'text-gray-400'}`}>
                  {day}
                </div>
              ))}
            </div>

            {/* 캘린더 그리드 영역 (w-full 보장) */}
            <div className="grid grid-cols-7 gap-2 w-full">
              
              {/* 앞쪽 빈 칸 */}
              {[...Array(firstDayOfMonth)].map((_, i) => (
                <div key={`empty-start-${i}`} className="h-[110px] w-full p-2 rounded-2xl bg-white border border-gray-50"></div>
              ))}
              
              {/* 실제 날짜 칸 */}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const dayEvents = getEventsForDate(day);

                return (
                  <div key={day} className="h-[110px] w-full p-2 rounded-2xl border border-gray-50 transition flex flex-col overflow-hidden bg-white hover:border-[#3478B8]/30">
                    <span className="text-xs font-bold mb-1 text-[#4A4F58] ml-1">
                      {day}
                    </span>
                    <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                      {dayEvents.map(evt => (
                        <div 
                          key={evt.id} 
                          className={`text-[10px] font-bold px-2 py-1.5 rounded-lg truncate text-white shadow-sm w-full ${
                            evt.type === 'exam' ? 'bg-[#D9A23A]' : 'bg-[#3478B8]'
                          }`}
                        >
                          {evt.certName}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* 뒤쪽 빈 칸 (무조건 42칸을 채우도록 강제) */}
              {[...Array(trailingEmptyCells)].map((_, i) => (
                <div key={`empty-end-${i}`} className="h-[110px] w-full p-2 rounded-2xl bg-white border border-gray-50"></div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. 사이드바 섹션 */}
        <div className="lg:col-span-4 w-full min-w-0 space-y-6">
          
          <div className="bg-[#4A4F58] p-7 rounded-[32px] text-white shadow-lg w-full">
            <h3 className="text-sm font-bold mb-5 flex items-center text-[#A4B1CD]">
              <Clock className="mr-2 text-[#3BAA7D]" size={16} /> 선택한 자격증 일정
            </h3>
            
            {upcomingEvents.length === 0 ? (
              <div className="py-10 text-center text-sm font-medium text-gray-400">
                선택된 자격증 일정이 없습니다.
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map(item => (
                  <div key={item.id} className="p-4 bg-white/10 rounded-2xl border border-white/5 flex flex-col gap-1 w-full">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-gray-300 truncate pr-2">
                        {item.certName}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${item.type === 'exam' ? 'bg-[#D9A23A] text-white' : 'bg-[#3478B8] text-white'}`}>
                        {item.type === 'exam' ? '시험' : '접수'}
                      </span>
                    </div>
                    <p className="text-sm font-bold truncate">{item.title}</p>
                    <p className="text-[11px] text-gray-400 mt-1">{item.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-7 rounded-[32px] border border-gray-50 shadow-sm w-full">
            <h3 className="text-sm font-bold mb-5 flex items-center text-[#3BAA7D]">
              <MapPin className="mr-2" size={16} /> 고사장 안내
            </h3>
            <div className="aspect-[4/3] bg-[#F8F9FA] rounded-2xl relative overflow-hidden border border-gray-100 flex flex-col items-center justify-center w-full">
              <Navigation size={28} className="text-gray-300 mb-3" />
              <span className="text-[11px] font-medium text-gray-400">일정을 선택하면 위치가 표시됩니다</span>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default Calendar;