import axios from "axios";
import type { AuthUser } from "@/types/auth";
import type { Room } from "@/types/room";

const API_BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
});
const authHeader = () => {
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {

    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry once for 401 errors, not login request
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/api/v1/auth/login")
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh-token`, {
            refreshToken,
          });

          // Save new tokens
          localStorage.setItem("accessToken", data.accessToken);
          if (data.refreshToken) {
            localStorage.setItem("refreshToken", data.refreshToken);
          }

          // Retry original request with new access token
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch (refreshError: any) {
          logout();
          return Promise.reject(refreshError);
        }
      } else {

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
export async function loginUser(loginDetails: { email: string; password: string }) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, loginDetails, {
      validateStatus: (status) => status < 500, // Handle 401, 404 manually without throwing
    });

    if (response.status === 404) {
      throw { response: { status: 404, data: { message: "User not found" } } };
    }
    if (response.status === 401) {
      throw { response: { status: 401, data: { message: "Invalid credentials" } } };
    }
    if (response.status >= 400) {
      throw { response: { status: response.status, data: response.data } };
    }

    const { accessToken, refreshToken, id } = response.data;

    if (!accessToken || !refreshToken) {
      throw new Error("Login failed: tokens not received");
    }

    // Robust JWT decoding for URL-safe Base64 and missing padding
    const base64Payload = accessToken.split(".")[1];
    const base64 = base64Payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
    const payload = JSON.parse(atob(padded));

    const role = payload.role ?? "USER";
    // Prefer iss or jti for the email if sub is just a generic label like "Access APIs"
    const currentUser = (payload.sub && payload.sub !== "Access APIs")
      ? payload.sub
      : (payload.iss || payload.jti || loginDetails.email);

    // Store tokens and user info
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("role", role);
    localStorage.setItem("currentUser", currentUser);
    if (id) localStorage.setItem("userId", id.toString());

    return { accessToken, refreshToken, role, currentUser, id };
  } catch (error: any) {
    throw error;
  }
}

export async function registerUser(registrationDetails: any) {
  const { data } = await api.post("/api/v1/auth/register", registrationDetails);
  return data;
}

export async function refreshTokenUser(refreshToken: string) {
  const { data } = await api.post("/api/v1/auth/refresh-token", { refreshToken });
  return data;
}


export async function getAllUsers() {
  const { data } = await api.get("/api/v1/auth/all", {
    headers: authHeader(),
  });
  return data; // returns List<UserResponse> directly
}

export async function getUser(userId: string): Promise<AuthUser> {
  const { data } = await api.get(`/api/v1/auth/${userId}`, {
    headers: authHeader(),
  })
  return data
}

export async function deleteUser(userId: string) {
  const { data } = await api.delete(
    `/api/v1/users/delete/${userId}`,
    { headers: authHeader() }
  );
  return data;
}

export async function addRoom(formData: FormData) {
  const { data } = await api.post("/api/v1/rooms/create", formData, {
    headers: { ...authHeader() }, // ✅
  });
  return data;
}





export async function getRoomTypes() {
  const { data } = await api.get("/api/v1/rooms/types");
  return data;
}

export async function getAllRooms() {
  const { data } = await api.get("/api/v1/rooms/findAll"); // ✅ no headers
  return Array.isArray(data) ? data : (data.roomList || data.data || []);
}

export async function getRoomById(roomId: string): Promise<Room> {
  const { data } = await api.get(`/api/v1/rooms/findById/${roomId}`, {
    headers: authHeader(),
  });
  return data.room || data.roomData || data.data || data;
}

export async function deleteRoom(roomId: string) {
  const { data } = await api.delete(
    `/api/v1/rooms/delete/${roomId}`,
    { headers: authHeader() }
  );
  return data;
}

export async function updateRoom(roomId: string, formData: FormData) {
  const { data } = await api.put(`/api/v1/rooms/update/${roomId}`, formData, {
    headers: {
      ...authHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

/* =======================
   ROOM TYPES
======================= */
export async function getAllRoomTypes() {
  try {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const { data } = await api.get("/api/v1/roomTypes/findAll", config);
    return data;
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 401) {
      console.warn("getAllRoomTypes: unauthorized (401)");
    } else {
      console.error("Error fetching room types:", status ?? error?.message);
    }
    return [];
  }
}

export async function createRoomType(roomTypeData: any) {
  const { data } = await api.post("/api/v1/roomTypes/create", roomTypeData, {
    headers: authHeader(),
  });
  return data;
}

export async function updateRoomType(id: string | number, roomTypeData: any) {
  const { data } = await api.put(`/api/v1/roomTypes/update/${id}`, roomTypeData, {
    headers: authHeader(),
  });
  return data;
}

export async function deleteRoomType(id: string | number) {
  const { data } = await api.delete(`/api/v1/roomTypes/delete/${id}`, {
    headers: authHeader(),
  });
  return data;
}

/* =======================
   BOOKINGS
======================= */
// export async function createBooking(booking: any) {
//   const { data } = await api.post(
//     `${API_BASE_URL}/api/v1/bookings/create`,
//     booking,
//     { headers: authHeader() }
//   );
//   return data;
// }
export async function createBooking(booking: any) {
  const { data } = await api.post("/api/v1/bookings/create", booking);
  return data;
}


export async function updateBooking(id: string | number, bookingData: any) {
  const { data } = await api.put(
    `/api/v1/bookings/update/${id}`,
    bookingData,
    { headers: authHeader() }
  );
  return data;
}

export async function getAllBookings() {
  try {
    const { data } = await api.get("/api/v1/bookings/findAll", {
      headers: authHeader(),
    });
    // Ensure we return an array
    return Array.isArray(data) ? data : (data.bookingList || data.data || []);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}

export async function getBookingById(id: string | number) {
  const { data } = await api.get(`/api/v1/bookings/findById/${id}`, {
    headers: authHeader(),
  });
  return data;
}

export async function deleteBooking(id: string | number) {
  const { data } = await api.delete(`/api/v1/bookings/delete/${id}`, {
    headers: authHeader(),
  });
  return data;
}

export async function getUserBookings(userId: string) {
  const { data } = await api.get(
    `/api/v1/bookings/user/${userId}`,
    { headers: authHeader() }
  );
  return data;
}

export async function getBookingByConfirmationCode(code: string) {
  const { data } = await api.get(
    `/api/v1/bookings/get-by-confirmation-code/${code}`
  );
  return data;
}

export async function cancelBooking(bookingId: string) {
  // This seems to be a custom endpoint in the previous code, 
  // but typically delete or update status is used. 
  // Keeping it if the backend supports it, otherwise use deleteBooking.
  try {
    const { data } = await api.get(
      `/api/v1/bookings/cancel/${bookingId}`,
      { headers: authHeader() }
    );
    return data;
  } catch (error: any) {
    console.error("Cancel booking error:", error.response?.data);
    throw error;
  }
}

/* =======================
   SERVICE BOOKINGS
======================= */
export async function getAllServiceBookings() {
  try {
    const { data } = await api.get("/api/v1/booking_services/findAll", {
      headers: authHeader(),
    });
    return data;
  } catch (error) {
    console.error("Error fetching service bookings:", error);
    return [];
  }
}

export async function getServiceBookingById(id: string | number) {
  const { data } = await api.get(`/api/v1/booking_services/findById/${id}`, {
    headers: authHeader(),
  });
  return data;
}

export async function createServiceBooking(data: any) {
  const { data: response } = await api.post("/api/v1/booking_services/create", data, {
    headers: authHeader(),
  });
  return response;
}

export async function updateServiceBooking(id: string | number, data: any) {
  const { data: response } = await api.put(`/api/v1/booking_services/update/${id}`, data, {
    headers: authHeader(),
  });
  return response;
}

export async function deleteServiceBooking(id: string | number) {
  const { data } = await api.delete(`/api/v1/booking_services/delete/${id}`, {
    headers: authHeader(),
  });
  return data;
}

/* =======================
   AUTH HELPERS
======================= */

export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("role");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("userId");
  // Important: Clear the cookie to prevent middleware redirect loops
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

// Check authentication
export function isAuthenticated() {
  return !!localStorage.getItem("accessToken");
}

// Role checks
export function isAdmin() {
  return localStorage.getItem("role") === "ADMIN";
}

export function isUser() {
  return localStorage.getItem("role") === "USER";
}

export function isStaff() {
  return localStorage.getItem("role") === "STAFF";
}

/* =======================
   SERVICES
======================= */
export async function getAllServices() {
  try {
    const { data } = await api.get("/api/v1/services/findAll", {
      headers: authHeader(),
    });
    return data;
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}


export async function getServiceById(id: string | number) {
  const { data } = await api.get(`/api/v1/services/findById/${id}`, {
    headers: authHeader(),
  });
  return data;
}

export async function createService(formData: FormData) {
  const { data } = await api.post("/api/v1/services/create", formData, {
    headers: { ...authHeader(), "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateService(id: string | number, formData: FormData) {
  const { data } = await api.put(`/api/v1/services/update/${id}`, formData, {
    headers: { ...authHeader(), "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteService(id: string | number) {
  const { data } = await api.delete(`/api/v1/services/delete/${id}`, {
    headers: authHeader(),
  });
  return data;
}

/* =======================
   INVENTORY
======================= */
export async function getAllInventory() {
  try {
    const { data } = await api.get("/api/v1/inventory/findAll", {
      headers: authHeader(),
    });
    return data;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
}

export async function getInventoryById(id: string | number) {
  const { data } = await api.get(`/api/v1/inventory/findById/${id}`, {
    headers: authHeader(),
  });
  return data;
}

export async function createInventory(inventoryData: any) {
  const { data } = await api.post("/api/v1/inventory/create", inventoryData, {
    headers: authHeader(),
  });
  return data;
}

export async function updateInventory(id: string | number, inventoryData: any) {
  const { data } = await api.put(`/api/v1/inventory/update/${id}`, inventoryData, {
    headers: authHeader(),
  });
  return data;
}

export async function deleteInventory(id: string | number) {
  const { data } = await api.delete(`/api/v1/inventory/delete/${id}`, {
    headers: authHeader(),
  });
  return data;
}

/* =======================
   PAYPAL PAYMENTS
======================= */

export type PaypalCreateOrderResponse = {
  orderId: string;
  approvalUrl: string;
};

export type PaypalCaptureResponse = {
  orderId: string;
  captureId: string | null;
  status: string;
};

export async function createPaypalOrder(bookingId: number | string): Promise<PaypalCreateOrderResponse> {
  const { data } = await api.post(`/api/v1/payments/paypal/create/${bookingId}`);
  return data;
}

export async function capturePaypalOrder(orderId: string): Promise<PaypalCaptureResponse> {
  const { data } = await api.post(`/api/v1/payments/paypal/capture`, { orderId });
  return data;
}


