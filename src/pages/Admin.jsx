import React, { useState } from 'react';
import { 
  LayoutDashboard, Database, Users, MessageSquare, 
  Settings, Plus, Edit3, Trash2, ExternalLink,
  Search, Filter, ChevronRight, BarChart3
} from 'lucide-react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('certifications');

  return (
    <div className="min-h-screen bg-[#EAECEF] flex">
      {/* 사이드바 사이드 메뉴 */}
      <aside className="w-64 bg-[#4A4F58] text-white p-8 hidden md:block">
        <div className="flex items-center space-x-2 mb-12">
          <div className="w-8 h-8 bg-[#3478B8] rounded-lg flex items-center justify-center">
            <Settings size={18} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter">Admin Panel</span>
        </div>

        <nav className="space-y-2">
          <MenuBtn active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={18} />} label="대시보드" />
          <MenuBtn active={activeTab === 'certifications'} onClick={() => setActiveTab('certifications')} icon={<Database size={18} />} label="자격증 관리" />
          <MenuBtn active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={18} />} label="사용자 관리" />
          <MenuBtn active={activeTab === 'posts'} onClick={() => setActiveTab('posts')} icon={<MessageSquare size={18} />} label="게시글 관리" />
        </nav>
      </aside>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-[#4A4F58]">시스템 관리</h2>
            <p className="text-gray-400 font-medium mt-1">플랫폼의 핵심 데이터를 제어하고 모니터링합니다.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-gray-500">Server Online</span>
            </div>
          </div>
        </header>

        {/* 상단 요약 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <AdminStatCard label="총 사용자" value="1,284명" growth="+12%" icon={<Users className="text-[#3478B8]" />} />
          <AdminStatCard label="자격증 DB" value="420건" growth="+5" icon={<Database className="text-[#3BAA7D]" />} />
          <AdminStatCard label="오늘의 게시글" value="24건" growth="+8%" icon={<MessageSquare className="text-[#D9A23A]" />} />
        </div>

        {/* 데이터 관리 섹션 */}
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="text" 
                placeholder="데이터 검색..." 
                className="w-full bg-gray-50 border border-transparent p-3 pl-12 rounded-xl focus:border-[#3478B8] outline-none text-sm transition"
              />
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-3 bg-gray-50 text-gray-400 rounded-xl hover:text-[#3478B8] transition">
                <Filter size={18} />
              </button>
              <button className="bg-[#3478B8] text-white px-6 py-3 rounded-xl font-black text-sm flex items-center shadow-lg shadow-[#3478B8]/20 hover:opacity-90 transition">
                <Plus size={18} className="mr-2" /> 새 데이터 추가
              </button>
            </div>
          </div>

          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-8 py-4">ID</th>
                <th className="px-8 py-4">자격증 명칭</th>
                <th className="px-8 py-4">카테고리</th>
                <th className="px-8 py-4">조회수</th>
                <th className="px-8 py-4 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AdminRow id="001" name="정보처리산업기사" category="국가기술" views="1,420" />
              <AdminRow id="002" name="SQLD (개발자)" category="민간자격" views="925" />
              <AdminRow id="003" name="리눅스마스터 2급" category="국가기술" views="612" />
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

// --- 하위 컴포넌트 ---

const MenuBtn = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition ${active ? 'bg-[#3478B8] text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}
  >
    {icon}
    <span>{label}</span>
    {active && <ChevronRight size={14} className="ml-auto" />}
  </button>
);

const AdminStatCard = ({ label, value, growth, icon }) => (
  <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex justify-between items-center group hover:border-[#3478B8] transition-all">
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <h4 className="text-3xl font-black text-[#4A4F58] mb-2">{value}</h4>
      <span className="text-[10px] font-bold text-[#3BAA7D] bg-[#3BAA7D]/10 px-2 py-1 rounded">{growth}</span>
    </div>
    <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-[#3478B8]/5 transition-colors">
      {icon}
    </div>
  </div>
);

const AdminRow = ({ id, name, category, views }) => (
  <tr className="hover:bg-gray-50/50 transition group cursor-pointer">
    <td className="px-8 py-6 text-xs font-bold text-gray-300">#{id}</td>
    <td className="px-8 py-6 font-bold text-[#4A4F58]">{name}</td>
    <td className="px-8 py-6">
      <span className={`text-[10px] font-black px-2 py-1 rounded-md ${category === '국가기술' ? 'bg-[#3478B8]/10 text-[#3478B8]' : 'bg-[#D9A23A]/10 text-[#D9A23A]'}`}>
        {category}
      </span>
    </td>
    <td className="px-8 py-6 text-sm font-medium text-gray-400">{views}</td>
    <td className="px-8 py-6 text-right">
      <div className="flex justify-end space-x-2">
        <button className="p-2 text-gray-300 hover:text-[#3478B8] transition-colors"><Edit3 size={16} /></button>
        <button className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
      </div>
    </td>
  </tr>
);

export default Admin;