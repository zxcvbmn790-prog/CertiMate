import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 🚨 useNavigate 추가 (가입 후 이동용)
import { Award, Mail, Lock, User, BookOpen, CheckCircle } from 'lucide-react';
import axios from 'axios'; // 🚨 통신을 위한 axios 추가

/**
 * [Register 컴포넌트]
 * REQ-AUTH-001(소셜 로그인) 및 REQ-001(이메일 가입) 요구사항을 반영한 회원가입 화면입니다. 
 * 스프링 부트 백엔드와 Axios로 연동되어 데이터를 전송합니다.
 */
const Register = () => {
  const navigate = useNavigate(); // 페이지 이동 함수

  // 회원가입 폼 상태 관리
  const [formData, setFormData] = useState({
    email: '',
    pw: '',
    confirmPw: '',
    uname: '',
    major: '',
    interest: '',
    agreeConsent: false
  });

  // 💡 [캡스톤의 로직 추가]: 사용자가 타이핑할 때마다 formData 상태를 업데이트합니다.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 💡 [캡스톤의 로직 추가]: 체크박스(div 래퍼) 클릭 시 동의 상태를 토글합니다.
  const handleConsentToggle = () => {
    setFormData(prev => ({
      ...prev,
      agreeConsent: !prev.agreeConsent
    }));
  };

  // 💡 [캡스톤의 로직 추가]: '가입 완료하기' 버튼을 눌렀을 때 실행되는 폼 전송 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 새로고침 방지

    // 1. 프론트엔드 자체 방어 로직 (검증)
    if (formData.pw !== formData.confirmPw) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!formData.agreeConsent) {
      alert("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    try {
      // 2. 백엔드(스프링 부트)로 데이터 전송
      // 주의: 백엔드의 DTO 변수명(password, name)에 맞춰서 데이터를 매핑해줍니다.
      await axios.post('http://localhost:8080/api/auth/register', {
        email: formData.email,
        password: formData.pw, // 백엔드 DTO는 password
        name: formData.uname,  // 백엔드 DTO는 name
        major: formData.major,
        interest: formData.interest || '미입력', // 관심분야는 현재 UI에 없으므로 기본값 처리
        status: '재학중', // UI에 없으므로 기본값 (필요시 UI 추가)
        agreeConsent: formData.agreeConsent
      }, {
        withCredentials: true // 쿠키 및 세션 연동을 위한 필수 옵션
      });

      // 3. 성공 처리
      alert("환영합니다! 회원가입이 완료되었습니다.");
      navigate('/login'); // 로그인 페이지로 자동 이동

    } catch (error) {
      // 백엔드에서 던진 에러 메시지(예: "이미 존재하는 이메일입니다.") 출력
      console.error("회원가입 에러:", error);
      alert(error.response?.data?.message || error.response?.data || "회원가입에 실패했습니다.");
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
          <h2 className="text-2xl font-black tracking-tighter">자격한판 시작하기</h2>
          <p className="text-[#EAECEF]/70 text-xs mt-2 font-medium">지능형 자격증 플랫폼에 오신 것을 환영합니다.</p>
        </div>

        <div className="p-10 space-y-8">
          {/* REQ-AUTH-001: 소셜 로그인 연동 섹션  */}
          <button type="button" className="w-full bg-[#FEE500] text-[#3c1e1e] py-4 rounded-xl font-bold flex items-center justify-center shadow-sm hover:opacity-90 transition">
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg" alt="kakao" className="w-5 h-5 mr-3" />
            카카오로 1초 만에 시작하기
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-100 w-full"></div>
            <span className="bg-white px-4 text-[10px] text-gray-300 font-bold uppercase tracking-widest absolute">Or Email Join</span>
          </div>

          {/* REQ-001: 이메일 기반 회원가입 폼 */}
          {/* 🚨 onSubmit 이벤트를 폼에 연결합니다. */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 이름 입력 (ERD: uname)  */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="text" 
                  name="uname" // 🚨 name 속성 추가
                  value={formData.uname} // 🚨 state 연결
                  onChange={handleChange} // 🚨 이벤트 연결
                  required
                  placeholder="성함을 입력합니다" 
                  className="w-full bg-gray-50 border border-gray-100 p-4 pl-12 rounded-xl outline-none focus:border-[#3478B8] transition text-sm font-medium" 
                />
              </div>
            </div>

            {/* 이메일 입력 (ERD: email)  */}
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
                  placeholder="이메일 주소를 입력합니다" 
                  className="w-full bg-gray-50 border border-gray-100 p-4 pl-12 rounded-xl outline-none focus:border-[#3478B8] transition text-sm font-medium" 
                />
              </div>
            </div>

            {/* 비밀번호 입력 (ERD: pw - REQ-SYS-001 기반 암호화 대상) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    type="password" 
                    name="pw"
                    value={formData.pw}
                    onChange={handleChange}
                    required
                    placeholder="비밀번호" 
                    className="w-full bg-gray-50 border border-gray-100 p-4 pl-12 rounded-xl outline-none focus:border-[#3478B8] transition text-sm font-medium" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Confirm</label>
                <input 
                  type="password" 
                  name="confirmPw"
                  value={formData.confirmPw}
                  onChange={handleChange}
                  required
                  placeholder="재입력" 
                  className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl outline-none focus:border-[#3478B8] transition text-sm font-medium" 
                />
              </div>
            </div>

            {/* 전공 및 관심분야 (ERD: major, interest)  */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Academic Major</label>
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <select 
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-100 p-4 pl-12 rounded-xl outline-none focus:border-[#3478B8] appearance-none text-sm font-medium text-gray-500"
                >
                  <option value="">전공을 선택합니다</option>
                  <option value="소프트웨어 개발">소프트웨어 개발</option>
                  <option value="정보보안">정보보안</option>
                  <option value="데이터베이스">데이터베이스</option>
                </select>
              </div>
            </div>

            {/* 이용약관 동의 (ERD: agree_consent)  */}
            {/* 🚨 onClick 이벤트를 걸어서 클릭 시 체크되도록 만들고, 시각적 효과를 추가했습니다. */}
            <div 
              onClick={handleConsentToggle}
              className={`flex items-center p-4 bg-gray-50 rounded-xl border cursor-pointer group transition ${formData.agreeConsent ? 'border-[#3BAA7D]' : 'border-gray-100'}`}
            >
              <CheckCircle 
                size={18} 
                className={`transition ${formData.agreeConsent ? 'text-[#3BAA7D]' : 'text-gray-200 group-hover:text-[#3BAA7D]'}`} 
              />
              <span className={`ml-3 text-[11px] font-bold leading-tight transition ${formData.agreeConsent ? 'text-[#3BAA7D]' : 'text-gray-400'}`}>
                개인정보 수집 및 이용에 동의합니다 (필수) 
              </span>
            </div>

            <button type="submit" className="w-full bg-[#3478B8] text-white py-5 rounded-2xl font-black shadow-xl shadow-[#3478B8]/20 hover:bg-[#2e69a3] transition transform active:scale-[0.98]">
              가입 완료하기
            </button>
          </form>

          <p className="text-center text-[11px] font-bold text-gray-300">
            이미 계정이 있으신가요? <Link to="/login" className="text-[#3478B8] underline ml-1">로그인하기</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;