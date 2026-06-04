import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Award, Mail, Lock } from 'lucide-react';
import axios from 'axios'; // 🚨 백엔드 통신을 위한 axios

/**
 * [Login 컴포넌트]
 * 사용자의 이메일과 비밀번호를 받아 스프링 부트 백엔드 인증을 수행합니다.
 * 성공 시 백엔드로부터 HttpOnly 보안 쿠키(JWT)를 발급받아 브라우저에 저장합니다.
 */
const Login = () => {
  const navigate = useNavigate();

  // 로그인 폼 상태 관리
  const [formData, setFormData] = useState({
    email: '',
    pw: ''
  });

  // 💡 [캡스톤의 로직]: 사용자의 입력을 실시간으로 상태에 반영합니다.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 💡 [캡스톤의 핵심 로직]: 로그인 버튼 클릭 시 실행되는 폼 전송 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    // 방어 로직: 빈 값 체크
    if (!formData.email || !formData.pw) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      // 1. 스프링 부트 API로 POST 요청
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: formData.email,
        password: formData.pw // 백엔드 LoginRequest DTO의 필드명인 'password'에 맞춤
      }, {
        // 🚨 [캡스톤의 가장 중요한 팁]: 이 옵션이 켜져 있어야 백엔드가 주는 '쿠키'를 
        // 브라우저가 거부하지 않고 자신의 쿠키 저장소에 안전하게 보관합니다.
        withCredentials: true 
      });

      // 2. 로그인 성공 처리
      console.log("로그인 응답:", response.data);
      alert("환영합니다! 로그인에 성공했습니다.");
      
      // 3. 메인 홈 화면으로 이동 (추후 라우팅 구조에 맞춰 수정 가능)
      navigate('/'); 

    } catch (error) {
      // 4. 로그인 실패 처리 (비밀번호 틀림, 없는 이메일 등)
      console.error("로그인 에러:", error);
      alert(error.response?.data?.message || error.response?.data || "이메일 또는 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-[#EAECEF] flex items-center justify-center py-12 px-6">
      <div className="max-w-md w-full bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100">
        
        {/* 상단 로고 및 안내 */}
        <div className="bg-[#3478B8] p-10 text-center text-white">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Award size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-black tracking-tighter">자격한판 로그인</h2>
          <p className="text-[#EAECEF]/70 text-xs mt-2 font-medium">다시 오신 것을 환영합니다!</p>
        </div>

        <div className="p-10 space-y-8">
          {/* 소셜 로그인 (카카오) */}
          <button type="button" className="w-full bg-[#FEE500] text-[#3c1e1e] py-4 rounded-xl font-bold flex items-center justify-center shadow-sm hover:opacity-90 transition">
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg" alt="kakao" className="w-5 h-5 mr-3" />
            카카오로 1초 만에 로그인
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-100 w-full"></div>
            <span className="bg-white px-4 text-[10px] text-gray-300 font-bold uppercase tracking-widest absolute">Or Email Login</span>
          </div>

          {/* 이메일 기반 로그인 폼 */}
          {/* 🚨 onSubmit 이벤트를 폼에 연결하여 엔터키로도 로그인이 되도록 합니다. */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* 이메일 입력 */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="이메일 주소를 입력하세요" 
                  className="w-full bg-gray-50 border border-gray-100 p-4 pl-12 rounded-xl outline-none focus:border-[#3478B8] transition text-sm font-medium" 
                />
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-gray-400 uppercase">Password</label>
                <Link to="#" className="text-[10px] font-bold text-[#3478B8] hover:underline">비밀번호 찾기</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="password" 
                  name="pw"
                  value={formData.pw}
                  onChange={handleChange}
                  required
                  placeholder="비밀번호를 입력하세요" 
                  className="w-full bg-gray-50 border border-gray-100 p-4 pl-12 rounded-xl outline-none focus:border-[#3478B8] transition text-sm font-medium" 
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#3478B8] text-white py-5 rounded-2xl font-black shadow-xl shadow-[#3478B8]/20 hover:bg-[#2e69a3] transition transform active:scale-[0.98]">
              로그인하기
            </button>
          </form>

          <p className="text-center text-[11px] font-bold text-gray-300">
            아직 계정이 없으신가요? <Link to="/register" className="text-[#3478B8] underline ml-1">회원가입하기</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;