import { useEffect, useState } from "react";
import { useAuthStore } from "../store/user";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const user = useAuthStore((state) => state.user); // Ambil user
  const fetchUserProfile = useAuthStore((state) => state.fetchUserProfile); // Ambil fungsi fetch
  const changeName = useAuthStore((state) => state.changeName); // Ambil fungsi changeName
  const changeImage = useAuthStore((state) => state.changeImage); // Ambil fungsi changeImage
  const defaultImage = useAuthStore((state) => state.defaultImage); // Ambil fungsi changeImage
  const isLoading = useAuthStore((state) => state.isLoading);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);
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
    if (!user._id) {
      console.error("User ID is missing");
      alert("User ID is missing. Please log in again.");
      return; // Keluar dari fungsi jika ID tidak valid
    }

    if (isNameChanged) {
      try {
        // Panggil fungsi changeName dengan id
        await changeName(user._id, newName, user.email);
        setIsNameChanged(false); // Reset state setelah perubahan
      } catch (error) {
        console.error("Error during name change:", error);
        alert("Error while changing name. Please try again.");
      }
    }
  };
  const handleRequestOTP = async () => {
    setIsLoading(true);

    const result = await requestOTP(user._id, user.email);
    if (result) {
      navigate("/otp");
    }
    setIsLoading(false);
  };

  if (!user) {
    return <p>No user profile found.</p>;
  }

  ////////////////////////////////////////////////////////////////

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "profile_picture"); // Ganti dengan upload preset Anda
    formData.append("cloud_name", "dyxdhodds"); // Ganti dengan cloud name Anda

    try {
      setUploading(true);
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dyxdhodds/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log(data);
      if (data.secure_url) {
        alert("Image uploaded successfully!");
      }
      await changeImage(user._id, data.secure_url, user.email);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };
  const handleDeletePicture = async () => {
    await defaultImage(user._id, user.email);
  };

  ////////////////////////////////////////////////////////////////

  return (
    <div className="container mx-auto flex flex-col md:flex-row flex-wrap justify-center items-center pt-[100px]">
      <div>
        <img
          src={user.image}
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
            disabled={!isNameChanged}
          >
            Ubah Nama
          </button>
        )}
        <button
          onClick={handleRequestOTP}
          className={`bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 active:bg-blue-800 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-400 transition-all duration-200 ease-in-out mt-4 w-full max-w-sm ${
            isLoading ? "cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="animate-spin mx-auto"
            >
              <defs>
                <linearGradient
                  id="mingcuteLoadingFill0"
                  x1="50%"
                  x2="50%"
                  y1="5.271%"
                  y2="91.793%"
                >
                  <stop offset="0%" stopColor="currentColor" />
                  <stop
                    offset="100%"
                    stopColor="currentColor"
                    stopOpacity="0.55"
                  />
                </linearGradient>
                <linearGradient
                  id="mingcuteLoadingFill1"
                  x1="50%"
                  x2="50%"
                  y1="15.24%"
                  y2="87.15%"
                >
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
                  <stop
                    offset="100%"
                    stopColor="currentColor"
                    stopOpacity="0.55"
                  />
                </linearGradient>
              </defs>
              <g fill="none">
                <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                <path
                  fill="url(#mingcuteLoadingFill0)"
                  d="M8.749.021a1.5 1.5 0 0 1 .497 2.958A7.5 7.5 0 0 0 3 10.375a7.5 7.5 0 0 0 7.5 7.5v3c-5.799 0-10.5-4.7-10.5-10.5C0 5.23 3.726.865 8.749.021"
                  transform="translate(1.5 1.625)"
                />
                <path
                  fill="url(#mingcuteLoadingFill1)"
                  d="M15.392 2.673a1.5 1.5 0 0 1 2.119-.115A10.48 10.48 0 0 1 21 10.375c0 5.8-4.701 10.5-10.5 10.5v-3a7.5 7.5 0 0 0 5.007-13.084a1.5 1.5 0 0 1-.115-2.118"
                  transform="translate(1.5 1.625)"
                />
              </g>
            </svg>
          ) : (
            "Ubah Password"
          )}
        </button>
      </form>
      <div className="image-uploader">
        <h2>Upload Image to Cloudinary</h2>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 active:bg-blue-800 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-400 transition-all duration-200 ease-in-out mt-4 w-full max-w-sm ${
            isLoading ? "cursor-not-allowed" : ""
          }`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        <button
          onClick={handleDeletePicture}
          className={`bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 active:bg-blue-800 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-400 transition-all duration-200 ease-in-out mt-4 w-full max-w-sm ${
            isLoading ? "cursor-not-allowed" : ""
          }`}
        >
          Delete Profile Picutre
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
