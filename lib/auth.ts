import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export const AUTH_KEYS = {
    ROLE: "role",
    CURRENT_USER: "currentUser",
    USER_ID: "userId",
    IS_LOGGED_IN: "isLoggedIn",
} as const;

export async function logout() {
    try {
        await axios.post(`${API_BASE_URL}/api/v1/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
        console.error("Logout call failed:", err);
    } finally {
        Object.values(AUTH_KEYS).forEach((key) => {
            localStorage.removeItem(key);
        });

        if (typeof window !== "undefined") {
            window.location.href = "/";
        }
    }
}


export function isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(AUTH_KEYS.IS_LOGGED_IN) === "true";
}

export function isAdmin(): boolean {
    return localStorage.getItem(AUTH_KEYS.ROLE) === "ADMIN";
}

export function isUser(): boolean {
    return localStorage.getItem(AUTH_KEYS.ROLE) === "USER";
}

export function isStaff(): boolean {
    return localStorage.getItem(AUTH_KEYS.ROLE) === "STAFF";
}

export function getRole(): string | null {
    return localStorage.getItem(AUTH_KEYS.ROLE);
}
