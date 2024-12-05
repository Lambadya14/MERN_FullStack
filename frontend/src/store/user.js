import { create } from "zustand";

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: [],
  token: null,
  isLoading: false,
  isInitialized: false, // Flag untuk inisialisasi
  setUser: (user) => set({ user }),

  // Inisialisasi Auth dari LocalStorage
  initializeAuth: () => {
    const token = localStorage.getItem("token");
    if (token) {
      set({ isAuthenticated: true, isInitialized: true });
    } else {
      set({ isAuthenticated: false, isInitialized: true });
    }
  },
  createUser: async (newUser) => {
    if (
      !newUser.name ||
      !newUser.email ||
      !newUser.password ||
      !newUser.confPassword
    ) {
      return { success: false, message: "Please fill in all fields" };
    }

    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      // Cek jika fetch berhasil dengan res.ok
      if (!res.ok) {
        const errorData = await res.json();
        return {
          success: false,
          message: errorData.message || "Failed to register user",
        };
      }

      const data = await res.json();

      // Tambahkan data user ke state
      set((state) => ({
        user: [...state.user, data.data],
      }));

      return {
        success: true,
        message: data.message || "User created successfully",
      };
    } catch (error) {
      console.error("Error saat register:", error.message || error);
      return {
        success: false,
        message: error.message || "An error occurred during registration",
      };
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (data.success === true) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(data.data));
        localStorage.setItem("token", data.token);
      } else {
        console.log();
      }
      set({
        isAuthenticated: true,
        user: data.data,
        token: data.token,
      });
    } catch (error) {
      console.error("Error saat login:", error.message || error);
      alert(`Error saat login: ${error.message}`);
    }
  },

  fetchUserProfile: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    // Optional: Check if the token is a valid JWT
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      console.error("Invalid token format");
      return;
    }

    try {
      // Attempt to decode the token if it's in the correct format
      const decodedToken = JSON.parse(atob(tokenParts[1])); // Decode the payload
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

      // Check if the token has expired
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        console.error("Token has expired");
        return;
      }
    } catch (e) {
      console.error("Failed to decode token:", e);
      return;
    }

    set({ isLoading: true }); // Start loading

    try {
      const response = await fetch("/api/users/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const data = await response.json();

      // Only update state if data has changed
      set((state) => {
        if (JSON.stringify(state.user) !== JSON.stringify(data.data)) {
          return { user: data.data, isLoading: false }; // Update user and stop loading
        }
        return { ...state, isLoading: false }; // Stop loading if data is the same
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      set({ user: null, isLoading: false }); // Stop loading even on error
    }
  },

  logout: () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    set({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  },

  loadFromLocalStorage: () => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (isAuthenticated && user && token) {
      set({
        isAuthenticated: true,
        user: user,
        token: token,
      });
    } else {
      console.log("No valid data in localStorage");
    }
  },
  changeName: async (id, name, email) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/users/edit/username/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        // Fetch the error details for debugging purposes
        const errorDetails = await response.text();
        console.error("Error updating name:", errorDetails);
        throw new Error(`Failed to update name. Status: ${response.status}`);
      }

      const data = await response.json();

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(data.data));
      localStorage.setItem("token", data.token);

      // Update state with the new user data and token
      set({
        isAuthenticated: true,
        user: data.data,
        token: data.token,
      });
    } catch (error) {
      console.error("Error changing name:", error.message || error);
      alert(`Error changing name: ${error.message}`);
    }
  },
  requestOTP: async (userId, email) => {
    console.log(email, userId);
    try {
      const response = await fetch(`/api/users/request-otp/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, email }),
      });

      if (!response.ok) {
        // Fetch the error details for debugging purposes
        const errorDetails = await response.text();
        console.error("Error:", errorDetails);
        throw new Error(`Failed!. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error:", error.message || error);
    }
  },
  verifyOTP: async (userId, otp) => {
    try {
      const response = await fetch(`/api/users/verify-otp/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp }),
      });

      if (!response.ok) {
        // Fetch the error details for debugging purposes
        const errorDetails = await response.text();
        console.error("Error:", errorDetails.message);
        throw new Error(`Failed!. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error:", error.message || error);
    }
  },
  changePassword: async (newPassword, email, id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`/api/users/edit/password/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword, email }),
      });

      if (!response.ok) {
        // Fetch the error details for debugging purposes
        const errorDetails = await response.text();
        console.error("Error:", errorDetails);
        throw new Error(`Failed. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      // Update state with the new user data and token
      set({
        isAuthenticated: true,
        user: data.data,
        token: data.token,
      });
    } catch (error) {
      console.error("Error changing name:", error.message || error);
      alert(`Error changing name: ${error.message}`);
    }
  },
}));
