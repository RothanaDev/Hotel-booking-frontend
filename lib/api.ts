import axios from "axios";
import type { SendVerificationRequest, VerificationRequest } from "@/types/auth";
import type { Room } from "@/types/room";
import { isAuthenticated, logout, AUTH_KEYS } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://hotel-booking-backend-uder.onrender.com";


const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers: ((success: boolean) => void)[] = [];

const subscribeTokenRefresh = (cb: (success: boolean) => void) => {
  refreshSubscribers.push(cb);
};

const onTokenRefreshed = (success: boolean) => {
  refreshSubscribers.map((cb) => cb(success));
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthPath =
      originalRequest.url?.includes("/api/v1/auth/login") ||
      originalRequest.url?.includes("/api/v1/auth/refresh-token") ||
      originalRequest.url?.includes("/api/v1/auth/logout");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthPath) {
      if (!isAuthenticated()) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((success) => {
            if (success) {
              resolve(api(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(`${API_BASE_URL}/api/v1/auth/refresh-token`, {}, { withCredentials: true });

        isRefreshing = false;
        onTokenRefreshed(true);
        return api(originalRequest);
      } catch (refreshError: unknown) {
        isRefreshing = false;
        onTokenRefreshed(false);
        if (isAuthenticated()) {
          logout();
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/* =======================
   AUTHENTICATION
======================= */
export async function getMe() {
  try {
    const { data } = await api.get("/api/v1/auth/me");
    return data;
  } catch (error) {
    throw error;
  }
}

export async function loginUser(loginDetails: { email: string; password: string }) {
  try {
    const response = await api.post("/api/v1/auth/login", loginDetails, {
      validateStatus: (status) => status < 500,
    });

    if (response.status >= 400) {
      const error = new Error(response.data?.message || response.data?.error?.reason || "Authentication failed");
        (error as Error & { response?: typeof response }).response = response;
      throw error;
    }

    const { id } = response.data;
    const userData = await getMe();

    localStorage.setItem(AUTH_KEYS.IS_LOGGED_IN, "true");
    localStorage.setItem(AUTH_KEYS.ROLE, userData.role ?? "USER");
    localStorage.setItem(AUTH_KEYS.CURRENT_USER, userData.email);
    if (id) localStorage.setItem(AUTH_KEYS.USER_ID, id.toString());

    return { ...userData, id };
  } catch (error: unknown) {
    throw error;
  }
}

export interface RegistrationDetails {
  email: string;
  password: string;
  [key: string]: unknown;
}
export async function registerUser(registrationDetails: RegistrationDetails) {
  const { data } = await api.post("/api/v1/auth/register", registrationDetails);
  return data;
}

export async function sendVerification(sendVerificationRequest: SendVerificationRequest) {
  await api.post("/api/v1/auth/send-verification", sendVerificationRequest);
}

export async function resendVerification(sendVerificationRequest: SendVerificationRequest) {
  await api.post("/api/v1/auth/resend-verification", sendVerificationRequest);
}

export async function verifyEmail(verificationRequest: VerificationRequest) {
  await api.post("/api/v1/auth/verify", verificationRequest);
}

/* =======================
   ROOMS
======================= */
export async function getAllRooms() {
  const { data } = await api.get("/api/v1/rooms");
  return Array.isArray(data) ? data : (data.roomList || data.data || []);
}

export async function getRoomById(roomId: string): Promise<Room> {
  const { data } = await api.get(`/api/v1/rooms/${roomId}`);
  return data.room || data.roomData || data.data || data;
}

export async function getAllRoomTypes() {
  try {
    const { data } = await api.get("/api/v1/roomTypes");
    return data;
  } catch {
    return [];
  }
}

/* =======================
   BOOKINGS
======================= */
import type { Booking } from "@/types/booking";
export async function createBooking(booking: Booking) {
  const { data } = await api.post("/api/v1/bookings/create", booking);
  return data;
}

export async function getUserBookings(userId: string) {
  const { data } = await api.get(`/api/v1/bookings/user/${userId}`);
  return data;
}

/* =======================
   SERVICES
======================= */
export async function getAllServices() {
  try {
    const { data } = await api.get("/api/v1/services");
    return data;
  } catch {
    return [];
  }
}

/* =======================
   PAYPAL PAYMENTS
======================= */
import type { PaypalCreateOrderResponse, PaypalCaptureResponse } from "@/types/paypal";

export async function createPaypalOrder(bookingId: number | string): Promise<PaypalCreateOrderResponse> {
  const { data } = await api.post(`/api/v1/payments/paypal/create/${bookingId}`);
  return data;
}

export async function capturePaypalOrder(orderId: string): Promise<PaypalCaptureResponse> {
  const { data } = await api.post(`/api/v1/payments/paypal/capture`, { orderId });
  return data;
}
