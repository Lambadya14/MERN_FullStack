import { Link, useNavigate } from "react-router-dom";
import CreateAccount from "../assets/Create.svg";
import { useAuthStore } from "../store/user";
import { useState } from "react";

const Register = () => {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    confPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { createUser } = useAuthStore();
  const handleAddUser = async (e) => {
    e.preventDefault();
    const result = await createUser(newUser);
    console.log(result.message);
    setNewUser({ name: "", email: "", password: "", confPassword: "" });
    if (result.success === true) {
      navigate("/login");
    }
  };
  return (
    <div className="flex flex-wrap justify-center items-center h-screen px-4">
      <form className="flex flex-col justify-center items-center w-full max-w-md lg:w-1/2 mb-6 lg:mb-0">
        <h1 className="font-bold text-4xl text-center">Create Account</h1>

        <div className="mt-6 w-full">
          <div className="relative mb-6">
            <input
              type="text"
              id="nama"
              className="peer w-full border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent text-gray-900 placeholder-transparent"
              placeholder="Nama"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <label
              htmlFor="nama"
              className="absolute left-0 text-gray-500 peer-placeholder-shown:top-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all duration-200 -top-5 text-sm"
            >
              Nama
            </label>
          </div>
          <div className="relative mb-6">
            <input
              type="email"
              id="email"
              className="peer w-full border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent text-gray-900 placeholder-transparent"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
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
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
            <label
              htmlFor="password"
              className="absolute left-0 text-gray-500 peer-placeholder-shown:top-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all duration-200 -top-5 text-sm"
            >
              Password
            </label>
          </div>
          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              id="confirm-password"
              className="peer w-full border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent text-gray-900 placeholder-transparent"
              placeholder="Confirm Password"
              value={newUser.confPassword}
              onChange={(e) =>
                setNewUser({ ...newUser, confPassword: e.target.value })
              }
            />
            <label
              htmlFor="confirm-password"
              className="absolute left-0 text-gray-500 peer-placeholder-shown:top-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all duration-200 -top-5 text-sm"
            >
              Confirm Password
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
          type="submit"
          className="bg-blue-300 hover:bg-blue-400 focus:bg-blue-500 active:bg-blue-600 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-400 transition-all duration-200 ease-in-out mt-4 w-full"
          onClick={handleAddUser}
        >
          Register
        </button>

        <p className="mt-4">
          Sudah punya akun? Yuk{" "}
          <Link to="/login" className="text-blue-500">
            masuk
          </Link>{" "}
          😁
        </p>
      </form>

      <div className="w-full lg:w-1/2 flex justify-center">
        <img src={CreateAccount} alt="create" className="w-full " />
      </div>
    </div>
  );
};

export default Register;
