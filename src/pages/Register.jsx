import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Mail, Lock, User, BookOpen, CheckCircle } from 'lucide-react';

/**
 * [Register 컴포넌트]
 * REQ-AUTH-001(소셜 로그인) 및 REQ-001(이메일 가입) 요구사항을 반영한 회원가입 화면입니다. 
 * ERD의 USER 테이블 필드(email, pw, uname, major 등)를 데이터로 수집합니다. 
 */
const Register = () => {
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
          <button className="w-full bg-[#FEE500] text-[#3c1e1e] py-4 rounded-xl font-bold flex items-center justify-center shadow-sm hover:opacity-90 transition">
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg" alt="kakao" className="w-5 h-5 mr-3" />
            카카오로 1초 만에 시작하기
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-100 w-full"></div>
            <span className="bg-white px-4 text-[10px] text-gray-300 font-bold uppercase tracking-widest absolute">Or Email Join</span>
          </div>

          {/* REQ-001: 이메일 기반 회원가입 폼 [cite: 22] */}
          <form className="space-y-5">
            {/* 이름 입력 (ERD: uname)  */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input type="text" placeholder="성함을 입력합니다" className="w-full bg-gray-50 border border-gray-100 p-4 pl-12 rounded-xl outline-none focus:border-[#3478B8] transition text-sm font-medium" />
              </div>
            </div>

            {/* 이메일 입력 (ERD: email)  */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input type="email" placeholder="이메일 주소를 입력합니다" className="w-full bg-gray-50 border border-gray-100 p-4 pl-12 rounded-xl outline-none focus:border-[#3478B8] transition text-sm font-medium" />
              </div>
            </div>

            {/* 비밀번호 입력 (ERD: pw - REQ-SYS-001 기반 암호화 대상) [cite: 25, 27] */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input type="password" placeholder="비밀번호" className="w-full bg-gray-50 border border-gray-100 p-4 pl-12 rounded-xl outline-none focus:border-[#3478B8] transition text-sm font-medium" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Confirm</label>
                <input type="password" placeholder="재입력" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl outline-none focus:border-[#3478B8] transition text-sm font-medium" />
              </div>
            </div>

            {/* 전공 및 관심분야 (ERD: major, interest)  */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Academic Major</label>
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <select className="w-full bg-gray-50 border border-gray-100 p-4 pl-12 rounded-xl outline-none focus:border-[#3478B8] appearance-none text-sm font-medium text-gray-500">
                  <option>전공을 선택합니다</option>
                  <option>소프트웨어 개발</option>
                  <option>정보보안</option>
                  <option>데이터베이스</option>
                </select>
              </div>
            </div>

            {/* 이용약관 동의 (ERD: agree_consent)  */}
            <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer group">
              <CheckCircle size={18} className="text-gray-200 group-hover:text-[#3BAA7D] transition" />
              <span className="ml-3 text-[11px] font-bold text-gray-400 leading-tight">
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

export default Register; /* blame test */
