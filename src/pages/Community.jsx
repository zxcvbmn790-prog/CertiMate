import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MessageSquare, ThumbsUp, Eye, Edit3, Clock } from 'lucide-react';

const Community = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('전체');

  // 🚨 [권한 방어 로직] 글쓰기 버튼을 눌렀을 때 실행됩니다.
  const handleWriteClick = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다. 로그인 화면으로 이동합니다.");
      navigate('/login');
    } else {
      // 나중에 글쓰기 페이지를 만들면 이곳으로 이동합니다.
      navigate('/community/write');
    }
  };

  // UI용 가짜 데이터 (나중에는 백엔드 DB에서 불러오게 됩니다)
  const dummyPosts = [
    { id: 1, category: '합격수기', title: '정보처리기사 3주 단기 합격 비법 공유합니다!', author: '자격증마스터', time: '10분 전', views: 152, likes: 24, comments: 8 },
    { id: 2, category: 'Q&A', title: '이번 SQLD 49회차 난이도 어땠나요? 부분점수 있나요?', author: '데이터초보', time: '1시간 전', views: 89, likes: 2, comments: 15 },
    { id: 3, category: '자유게시판', title: '오늘 토익스피킹 시험 망친 것 같아요 ㅠㅠ 위로좀...', author: '취준생A', time: '3시간 전', views: 204, likes: 11, comments: 32 },
    { id: 4, category: '스터디모집', title: 'AWS SAA 자격증 평일 저녁 스터디원 모집 (2/4)', author: '클라우드짱', time: '5시간 전', views: 67, likes: 1, comments: 4 },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#EAECEF] p-6 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* 상단 타이틀 및 검색 영역 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100 gap-6">
          <div>
            <h2 className="text-3xl font-black text-gray-800">커뮤니티</h2>
            <p className="text-gray-400 mt-2 font-medium">자격한판 회원들과 유용한 정보와 고민을 나눠보세요.</p>
          </div>
          
          <div className="flex items-center w-full md:w-auto gap-4">
            {/* 검색창 */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="관심있는 자격증 검색" 
                className="w-full bg-gray-50 border border-gray-100 py-3 pl-12 pr-4 rounded-xl text-sm font-medium outline-none focus:border-[#3478B8] transition"
              />
            </div>
            
            {/* 🚨 글쓰기 버튼 (방어 로직 연결됨) */}
            <button 
              onClick={handleWriteClick}
              className="flex-shrink-0 bg-[#3478B8] text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-[#3478B8]/20 hover:bg-[#2a6296] transition transform active:scale-95 flex items-center"
            >
              <Edit3 size={18} className="mr-2" /> 새 글 쓰기
            </button>
          </div>
        </div>

        {/* 카테고리 탭 */}
        <div className="flex space-x-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          {['전체', '합격수기', 'Q&A', '스터디모집', '자유게시판'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-[#3478B8] text-white shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 게시글 목록 영역 */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {dummyPosts.map((post) => (
              <div key={post.id} className="p-6 hover:bg-gray-50 transition cursor-pointer flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-blue-50 text-[#3478B8] text-xs font-black rounded-lg">
                      {post.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-800 hover:text-[#3478B8] transition">
                      {post.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                    <span className="flex items-center text-gray-600"><div className="w-5 h-5 rounded-full bg-gray-200 mr-2"></div>{post.author}</span>
                    <span className="flex items-center"><Clock size={14} className="mr-1" />{post.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-5 text-gray-400 text-sm font-medium">
                  <div className="flex items-center gap-1.5"><Eye size={16} /> {post.views}</div>
                  <div className="flex items-center gap-1.5 text-red-400"><ThumbsUp size={16} /> {post.likes}</div>
                  <div className="flex items-center gap-1.5 text-[#3478B8]"><MessageSquare size={16} /> {post.comments}</div>
                </div>
                
              </div>
            ))}
          </div>
          
          {/* 더보기 버튼 */}
          <div className="p-4 bg-gray-50 text-center border-t border-gray-50">
            <button className="text-sm font-bold text-gray-500 hover:text-[#3478B8] transition">
              게시글 더보기 +
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Community;