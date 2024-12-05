import { useState } from "react";
import ResetImage from "../assets/ResetPassword.svg"; // Pastikan file gambar diunduh dan disimpan dalam folder assets
import { useAuthStore } from "../store/user";
import { useNavigate } from "react-router-dom";

const ChangePasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const user = useAuthStore((state) => state.user); // Ambil user
  const changePassword = useAuthStore((state) => state.changePassword);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Password baru dan konfirmasi password tidak cocok!");
      return;
    }
    const result = await changePassword(newPassword, user.email, user.userId);
    if (result) {
      navigate("/");
    }
    console.log("Password berhasil diubah");
    // Lakukan logika pengubahan password di sini
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gray-50">
      {/* Gambar Sisi Kiri */}
      <div className="hidden lg:block w-1/2">
        <img
          src={ResetImage}
          alt="Reset Password"
          className="w-full max-w-lg mx-auto"
        />
      </div>

      {/* Form Ubah Password */}
      <div className="w-full lg:w-1/2 p-8 bg-white shadow-lg rounded-lg max-w-md">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Ubah Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600">Password Baru</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Masukkan password baru"
            />
          </div>
          <div>
            <label className="block text-gray-600">
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Konfirmasi password baru"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            Ubah Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
