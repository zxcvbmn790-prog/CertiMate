import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// 🚨 [아이콘 추가] 눈 모양 아이콘(Eye, EyeOff)을 새로 가져왔습니다!
import { User, Mail, Lock, BookOpen, Eye, EyeOff } from 'lucide-react';
import api from '../api/axios';

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    major: '',
  });

  // 🚨 [상태 추가] 비밀번호 보이기/숨기기 상태 관리
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🚨 [유효성 검사 함수] 이메일 형식이 맞는지 검사하는 정규식
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // 이메일 형식 방어
    if (!isValidEmail(formData.email)) {
      alert("정확한 이메일 형식으로 입력해주세요.");
      return;
    }

    // 비밀번호 일치 방어
    if (formData.password !== formData.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        major: formData.major,
        interest: "미입력", 
        status: "미입력",
        agreeConsent: true
      };
      await api.post('/auth/register', payload);
      alert("회원가입이 완료되었습니다! 로그인해주세요.");
      navigate('/login');
    } catch (error) {
      alert("회원가입 실패: 입력 정보를 다시 확인해주세요.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#EAECEF] flex items-center justify-center py-12 px-6">
      <div className="max-w-md w-full bg-white rounded-[32px] shadow-2xl border border-gray-100 p-10">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-gray-800">새 계정 만들기</h2>
          <p className="text-gray-400 text-xs mt-2 font-medium">자격한판과 함께 새로운 도전을 시작하세요.</p>
        </div>

        <button 
          type="button"
          onClick={() => {
            const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
            const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;
            window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
          }}
          className="w-full bg-[#FEE500] text-[#3c1e1e] py-4 rounded-xl font-bold flex items-center justify-center shadow-sm hover:opacity-90 transition mb-6"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg" alt="kakao" className="w-5 h-5 mr-3" />
          카카오톡으로 3초 만에 가입하기
        </button>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-gray-100 w-full"></div>
          <span className="bg-white px-4 text-[10px] text-gray-300 font-black uppercase tracking-widest absolute">Or Email Signup</span>
        </div>

        <form className="space-y-4" onSubmit={handleRegister}>
          {/* 이메일 */}
          <div className="space-y-1">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="이메일 주소" className="w-full bg-gray-50 border border-gray-100 p-3 pl-12 rounded-xl text-sm font-medium outline-none focus:border-[#3478B8]" required />
            </div>
            {/* 🚨 실시간 이메일 검증 피드백 */}
            {formData.email.length > 0 && !isValidEmail(formData.email) ? (
              <p className="text-[10px] text-red-500 font-bold ml-2">* 정확한 이메일 형식으로 입력해주세요. (예: abc@def.com)</p>
            ) : formData.email.length > 0 && isValidEmail(formData.email) ? (
              <p className="text-[10px] text-[#3478B8] font-bold ml-2">* 올바른 이메일 형식입니다.</p>
            ) : (
              <p className="text-[10px] text-gray-400 font-bold ml-2">* 실제 사용하시는 이메일을 입력해주세요.</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="space-y-1">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              {/* 🚨 type을 showPassword 상태에 따라 동적으로 변경 */}
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="비밀번호" className="w-full bg-gray-50 border border-gray-100 p-3 pl-12 pr-12 rounded-xl text-sm font-medium outline-none focus:border-[#3478B8]" required />
              {/* 🚨 눈 모양 아이콘 버튼 */}
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3478B8] transition">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-[10px] text-gray-400 font-bold ml-2">* 영문 소문자/숫자 조합 4~16자로 입력해주세요.</p>
          </div>

          {/* 비밀번호 확인 */}
          <div className="space-y-1">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input type={showPasswordConfirm ? "text" : "password"} name="passwordConfirm" value={formData.passwordConfirm} onChange={handleChange} placeholder="비밀번호 확인" className="w-full bg-gray-50 border border-gray-100 p-3 pl-12 pr-12 rounded-xl text-sm font-medium outline-none focus:border-[#3478B8]" required />
              <button type="button" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3478B8] transition">
                {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* 🚨 실시간 비밀번호 일치 검증 피드백 */}
            {formData.passwordConfirm.length > 0 && formData.password !== formData.passwordConfirm ? (
              <p className="text-[10px] text-red-500 font-bold ml-2">* 비밀번호가 일치하지 않습니다.</p>
            ) : formData.passwordConfirm.length > 0 && formData.password === formData.passwordConfirm ? (
              <p className="text-[10px] text-green-500 font-bold ml-2">* 비밀번호가 일치합니다.</p>
            ) : null}
          </div>

          {/* 이름 */}
          <div className="space-y-1">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="실명" className="w-full bg-gray-50 border border-gray-100 p-3 pl-12 rounded-xl text-sm font-medium outline-none focus:border-[#3478B8]" required />
            </div>
          </div>

          {/* 전공 */}
          <div className="space-y-1">
            <div className="relative">
              <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input type="text" name="major" value={formData.major} onChange={handleChange} placeholder="전공 (예: 컴퓨터공학과)" className="w-full bg-gray-50 border border-gray-100 p-3 pl-12 rounded-xl text-sm font-medium outline-none focus:border-[#3478B8]" required />
            </div>
          </div>

          <button type="submit" className="w-full bg-[#3478B8] text-white py-4 rounded-xl font-black mt-2 shadow-md hover:bg-[#2a6296] transition">
            가입하기
          </button>
        </form>

        <p className="text-center text-xs font-bold text-gray-400 mt-6">
          이미 계정이 있으신가요? 
          <Link to="/login" className="text-[#3478B8] ml-1 hover:underline">로그인하기</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;