import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, PenTool, Eye, Flame, ChevronRight } from 'lucide-react'; // ChevronRight를 추가합니다.
const Community = () => {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-black flex items-center">
            <MessageSquare className="mr-3 text-[#3478B8]" size={32} /> 커뮤니티
          </h2>
          <p className="text-gray-400 mt-2 font-medium">수험생들의 리얼한 합격 노하우를 확인합니다.</p>
        </div>
        <button className="bg-[#3478B8] text-white px-8 py-3 rounded-xl font-bold flex items-center shadow-lg hover:opacity-90 transition">
          <PenTool size={18} className="mr-2" /> 글쓰기
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-300 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex gap-8 text-sm font-bold">
          <span className="text-[#3478B8] cursor-pointer">전체</span>
          <span className="text-gray-300 hover:text-[#4A4F58] cursor-pointer transition">합격후기</span>
          <span className="text-gray-300 hover:text-[#4A4F58] cursor-pointer transition">자유게시판</span>
        </div>
        <div className="divide-y divide-gray-100">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-8 flex justify-between items-center hover:bg-gray-50 transition cursor-pointer group">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                   <span className="text-[10px] font-black text-[#3BAA7D] uppercase tracking-tighter">Verified</span>
                   <h4 className="font-bold text-lg group-hover:text-[#3478B8] transition">비전공자 정보처리산업기사 실기 한 번에 끝내기</h4>
                </div>
                <div className="flex items-center text-[10px] text-gray-400 font-bold space-x-4 uppercase">
                  <span>By. Admin</span>
                  <span className="flex items-center"><Eye size={12} className="mr-1" /> 1,240</span>
                  <span className="flex items-center text-[#D9A23A]"><Flame size={12} className="mr-1" /> Best Post</span>
                </div>
              </div>
              <ChevronRight className="text-gray-200 group-hover:text-[#3478B8] transition" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Community;