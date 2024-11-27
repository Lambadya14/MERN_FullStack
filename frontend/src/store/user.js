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

  // Fungsi login
  login: async (email, password) => {
    try {
      // Simulasi panggilan API login
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data.message);

      // Menyimpan data pengguna dan token ke localStorage
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(data.data));
      localStorage.setItem("token", data.token);

      // Mengubah state jika login berhasil
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

  // Fungsi logout
  logout: () => {
    // Menghapus data autentikasi dari localStorage
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Mengubah state ke nilai awal
    set({
      isAuthenticated: false,
      user: null,
      token: null,
    });
  },

  // Memuat data dari localStorage saat aplikasi dimuat ulang
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
    }
  },
}));
