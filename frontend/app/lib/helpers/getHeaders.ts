"use server";

import { headers as nextHeaders } from "next/headers";
import getAccessToken from "./getAccessToken";

class CustomHeaders {
  static async getHeaders() {
    const headers = new Headers();

    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");

    const ua = nextHeaders().get("user-agent");
    const browserLanguage = nextHeaders().get("accept-language");
    const secChUa = nextHeaders().get("sec-ch-ua");
    const secChUaPlatform = nextHeaders().get("sec-ch-ua-platform");
    const secChUaVersion = nextHeaders().get("sec-ch-ua-version");

    if (ua) headers.append("User-Agent", ua);
    if (browserLanguage) headers.append("Browser-Language", browserLanguage);
    if (secChUa) headers.append("SEC-CH-UA", secChUa);
    if (secChUaPlatform) headers.append("SEC-CH-UA-PLATFORM", secChUaPlatform);
    if (secChUaVersion) headers.append("SEC-CH-UA-VERSION", secChUaVersion);

    return headers;
  }

  static async getAuthHeaders() {
    const accessToken = await getAccessToken();
    const headers = new Headers();

    headers.append("Authorization", "Bearer" + accessToken);

    return headers;
  }
}

export default CustomHeaders;
