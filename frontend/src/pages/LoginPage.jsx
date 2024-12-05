import { Link, useNavigate } from "react-router-dom";
import LoginAccount from "../assets/Login.svg";
import { useState } from "react";
import { useAuthStore } from "../store/user";

const Login = () => {
  const navigate = useNavigate();
  const [loginUser, setLoginUser] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Menggunakan fungsi login dari useAuthStore
  const login = useAuthStore((state) => state.login);
  const handleLoginUser = async (e) => {
    e.preventDefault();
    console.log("Login User:", loginUser);
    // Panggil fungsi login dengan email dan password
    const { email, password } = loginUser;
    const result = await login(email, password); // Menggunakan fungsi login dari store
    // Reset form setelah login
    console.log(result);
    if (result.success) {
      // Jika login berhasil, reset form dan navigasi ke halaman utama
      setLoginUser({ email: "", password: "" });
      navigate("/");
    }
  };
  return (
    <div className="flex flex-wrap justify-center items-center h-screen px-4">
      {" "}
      <div className="w-full lg:w-1/2 flex justify-center">
        <img src={LoginAccount} alt="create" className="w-full " />
      </div>
      <form className="flex flex-col justify-center items-center w-full max-w-md lg:w-1/2 mb-6 lg:mb-0">
        <h1 className="font-bold text-4xl text-center">Login</h1>

        <div className="mt-6 w-full">
          <div className="relative mb-6">
            <input
              type="email"
              id="email"
              className="peer w-full border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent text-gray-900 placeholder-transparent"
              placeholder="Email"
              value={loginUser.email}
              onChange={(e) =>
                setLoginUser({ ...loginUser, email: e.target.value })
              }
            />
            <label
              htmlFor="email"
              className="absolute left-0 text-gray-500 peer-placeholder-shown:top-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all duration-200 -top-5 text-sm"
            >
              Email
            </label>
          </div>
          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="peer w-full border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent text-gray-900 placeholder-transparent"
              placeholder="Password"
              value={loginUser.password}
              onChange={(e) =>
                setLoginUser({ ...loginUser, password: e.target.value })
              }
            />
            <label
              htmlFor="password"
              className="absolute left-0 text-gray-500 peer-placeholder-shown:top-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all duration-200 -top-5 text-sm"
            >
              Password
            </label>
          </div>{" "}
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="showPassword"
              className="mr-2"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)} // Toggle state
            />
            <label htmlFor="showPassword" className="text-gray-600">
              Tampilkan Password
            </label>
          </div>
        </div>

        <button
          onClick={handleLoginUser}
          type="submit"
          className="bg-blue-300 hover:bg-blue-400 focus:bg-blue-500 active:bg-blue-600 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-400 transition-all duration-200 ease-in-out mt-4 w-full"
        >
          Login
        </button>

        <p className="mt-4">
          Belum punya akun? Yuk{" "}
          <Link to="/register" className="text-blue-500">
            daftar
          </Link>{" "}
          dulu 😁
        </p>
      </form>
    </div>
  );
};

export default Login;
