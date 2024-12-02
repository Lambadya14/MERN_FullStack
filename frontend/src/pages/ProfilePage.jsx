import FotoProfil from "../assets/Me.jpg";

const ProfilePage = () => {
  return (
    <div className="container mx-auto flex flex-col md:flex-row flex-wrap justify-center items-center pt-[100px]">
      <div>
        <img
          src={FotoProfil}
          alt="image"
          className="w-[350px] h-[350px] object-cover rounded-[500px]"
        />
      </div>
      <form className="flex flex-col justify-center items-center w-full max-w-md px-4 sm:px-6 lg:w-1/2 mb-6 lg:mb-0">
        <div className="mt-6 w-full">
          {/* Nama Input */}
          <div className="relative mb-8">
            <input
              type="Nama"
              id="Nama"
              className="peer w-full border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent text-gray-900 placeholder-transparent"
              placeholder="Nama"
            />
            <label
              htmlFor="Nama"
              className="absolute left-0 text-gray-500 peer-placeholder-shown:top-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all duration-200 -top-5 text-sm"
            >
              Nama
            </label>
          </div>

          {/* Password Input */}
          <div className="relative mb-8">
            <input
              type="Email"
              id="Email"
              className="peer w-full border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent text-gray-900 placeholder-transparent"
              placeholder="Email"
            />
            <label
              htmlFor="Email"
              className="absolute left-0 text-gray-500 peer-placeholder-shown:top-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all duration-200 -top-5 text-sm"
            >
              Email
            </label>
          </div>

          {/* Client Input */}
          <div className="relative mb-8">
            <input
              type="text"
              id="Client"
              className="peer w-full border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent text-gray-900 placeholder-transparent"
              placeholder="Client"
            />
            <label
              htmlFor="Client"
              className="absolute left-0 text-gray-500 peer-placeholder-shown:top-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all duration-200 -top-5 text-sm"
            >
              Client
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 active:bg-blue-800 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-400 transition-all duration-200 ease-in-out mt-4 w-full max-w-sm "
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
