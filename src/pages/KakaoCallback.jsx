import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // 🚨 이전에 만들어둔 axios.js 경로에 맞게 임포트!

const KakaoCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // 1. URL에서 카카오가 준 'code' 값을 뽑아냅니다.
        const code = new URL(window.location.href).searchParams.get("code");

        // 2. 백엔드로 코드를 쏩니다.
        const sendKakaoCode = async () => {
            try {
                const response = await api.post('/auth/kakao', { code: code });
                console.log(response.data);
                alert("카카오 로그인에 성공했습니다!");
                navigate('/'); // 홈으로 이동
            } catch (error) {
                console.error("카카오 로그인 실패:", error);
                alert("카카오 로그인에 실패했습니다.");
                navigate('/login');
            }
        };

        if (code) {
            sendKakaoCode();
        }
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#EAECEF]">
            <h2 className="text-xl font-bold text-gray-600">카카오 로그인 처리 중입니다... 잠시만 기다려주세요. 🚀</h2>
        </div>
    );
};

export default KakaoCallback;