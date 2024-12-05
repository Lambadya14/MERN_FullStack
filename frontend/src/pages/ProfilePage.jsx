import { useEffect, useState } from "react";
import FotoProfil from "../assets/Me.jpg";
import { useAuthStore } from "../store/user";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user); // Ambil user
  const fetchUserProfile = useAuthStore((state) => state.fetchUserProfile); // Ambil fungsi fetch
  const changeName = useAuthStore((state) => state.changeName); // Ambil fungsi changeName
  const isLoading = useAuthStore((state) => state.isLoading); // Ambil loading status
  const requestOTP = useAuthStore((state) => state.requestOTP);

  const navigate = useNavigate();

  // State untuk input nama lokal
  const [newName, setNewName] = useState(user?.name || "");
  const [isNameChanged, setIsNameChanged] = useState(false);

  // Fetch user profile saat komponen di-render
  useEffect(() => {
    if (!user && !isLoading) {
      fetchUserProfile(); // Fetch user jika belum ada dan tidak loading
    }
  }, [fetchUserProfile, user, isLoading]);

  useEffect(() => {
    setNewName(user?.name || "");
  }, [user]);

  const handleNameChange = (e) => {
    setNewName(e.target.value);
    setIsNameChanged(e.target.value !== user?.name); // Periksa apakah nama berubah
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Pastikan user dan user._id ada
    if (!user || !user.userId) {
      console.error("User ID is missing");
      alert("User ID is missing. Please log in again.");
      return; // Keluar dari fungsi jika ID tidak valid
    }

    if (isNameChanged) {
      try {
        // Panggil fungsi changeName dengan id
        await changeName(user.userId, newName, user.email);
        setIsNameChanged(false); // Reset state setelah perubahan
      } catch (error) {
        console.error("Error during name change:", error);
        alert("Error while changing name. Please try again.");
      }
    }
  };
  const handleRequestOTP = async () => {
    const result = await requestOTP(
      "67469966ef0551243ae825bb",
      "arieeeee511@gmail.com"
    );
    console.log(result);
    if (result) {
      navigate("/otp");
    }
  };

  if (isLoading) {
    return <p>Loading user profile...</p>;
  }

  if (!user) {
    return <p>No user profile found.</p>;
  }

  return (
    <div className="container mx-auto flex flex-col md:flex-row flex-wrap justify-center items-center pt-[100px]">
      <div>
        <img
          src={FotoProfil}
          alt="image"
          className="w-[350px] h-[350px] object-cover rounded-[500px]"
        />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center w-full max-w-md px-4 sm:px-6 lg:w-1/2 mb-6 lg:mb-0"
      >
        <div className="mt-6 w-full">
          {/* Nama Input */}
          <div className="relative mb-8">
            <input
              type="text"
              id="Nama"
              className="peer w-full border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent text-gray-900 placeholder-transparent"
              value={newName}
              onChange={handleNameChange}
            />
            <label
              htmlFor="Nama"
              className="absolute left-0 text-gray-500 peer-placeholder-shown:top-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all duration-200 -top-5 text-sm"
            >
              Nama
            </label>
          </div>

          {/* Email Input */}
          <div className="relative mb-8">
            <input
              type="email"
              id="Email"
              className="peer w-full border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent text-gray-900 placeholder-transparent"
              value={user?.email}
              disabled
            />
            <label
              htmlFor="Email"
              className="absolute left-0 text-gray-500 peer-placeholder-shown:top-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all duration-200 -top-5 text-sm"
            >
              Email
            </label>
          </div>
        </div>

        {/* Tampilkan tombol hanya jika nama berubah */}
        {isNameChanged && (
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 active:bg-blue-800 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-400 transition-all duration-200 ease-in-out mt-4 w-full max-w-sm"
          >
            Ubah Nama
          </button>
        )}
        <button onClick={handleRequestOTP}> Ubah Password</button>
      </form>
    </div>
  );
};

export default ProfilePage;
