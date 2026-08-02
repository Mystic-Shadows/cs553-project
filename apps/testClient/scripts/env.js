export const API_BASE_URL = "http://localhost:3000";
export var accessToken;
export function authHeaders(headers = {}) {
    return accessToken
        ? { ...headers, Authorization: `Bearer ${accessToken}` }
        : headers;
}

export function setAccessToken(token) {
    accessToken = token;
}
