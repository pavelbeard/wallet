"use server";

import { cookies } from "next/headers";
import setCookie from "set-cookie-parser";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { API_URL } from "@/constants";

export async function setCookies(response: Response) {
    const cookieStore = cookies();
    const responseCookies = response.headers.getSetCookie();
    responseCookies.forEach(cookie => {
        const parsedCookie = setCookie(cookie)[0];
        cookieStore.set({ ...parsedCookie } as ResponseCookie);
    });
}

export async function signIn(formData: FormData) {
    const data = Object.fromEntries(formData);
    try {
        const response = await fetch(`${API_URL}/stuff/auth/signin/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: "include",
        })

        if (response?.ok) {
            await setCookies(response);
            return 1;
        } else {
            return 2;
        }
    } catch (e) {
        return 3;
    }
}

export async function signOut() {
    try {
        const response = await fetch(`${API_URL}/stuff/auth/signout/`, {
            method: "POST",
            credentials: "include",
        });

        if (response?.ok) {
            return 1;
        }
    } catch (e) {
        return 2;
    }
}
