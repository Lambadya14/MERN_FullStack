import { create } from "zustand";

export const useUserRegisterStore = create((set) => ({
  user: [],
  setUser: (user) => set({ user }),
  createUser: async (newUser) => {
    if (
      !newUser.name ||
      !newUser.email ||
      !newUser.password ||
      !newUser.confPassword
    ) {
      return { success: false, message: "Please fill in all fields" };
    }
    const res = await fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
    const data = await res.json();
    set((state) => ({
      user: [...state.user, data.data],
    }));
    return { success: true, message: "User created successfully" };
  },
}));

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,

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

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(data.data));
      localStorage.setItem("token", data.token);

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
    if (!token) return;

    try {
      const response = await fetch("/api/users/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch user profile");

      const data = await response.json();

      if (data?.success) {
        set({ user: data.data });
      } else {
        set({ user: null });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      set({ user: null });
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
}));
