import { useState } from "react";
import OTP from "../assets/OTP.svg";
import { useAuthStore } from "../store/user";
import { useNavigate } from "react-router-dom";

const OtpPage = () => {
  const [otp, setOtp] = useState(Array(6).fill("")); // Menggunakan array untuk input OTP
  const user = useAuthStore((state) => state.user); // Ambil user
  const requestOTP = useAuthStore((state) => state.requestOTP);
  const verifyOTP = useAuthStore((state) => state.verifyOTP);
  const navigate = useNavigate();

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Hanya mengambil 1 digit terakhir
    setOtp(newOtp);

    // Auto focus ke input berikutnya jika ada
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  };

  const handleRequestOTP = async () => {
    await requestOTP(user._id, user.email);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    const otpCode = otp.join("");
    console.log(otpCode);
    const result = await verifyOTP(user._id, otpCode);
    console.log(result);
    if (result) {
      navigate("/reset");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <div className="text-center mb-6">
          <img src={OTP} alt="OTP Illustration" className="w-32 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-700">
            Masukkan Kode OTP
          </h2>
          <p className="text-gray-500 mt-2">
            Kode OTP telah dikirim ke email Anda
          </p>
        </div>
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 border border-gray-300 rounded text-center text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                maxLength={1}
                pattern="[0-9]*"
                inputMode="numeric"
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
            onClick={handleVerifyOTP}
          >
            Verifikasi
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Tidak menerima kode?{" "}
          <a
            href="#"
            className="text-indigo-500 hover:underline"
            onClick={handleRequestOTP}
          >
            Kirim ulang
          </a>
        </p>
      </div>
    </div>
  );
};

export default OtpPage;
