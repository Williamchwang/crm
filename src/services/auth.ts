// 登录认证API服务
const TOKEN_URL = "/api/auc/oauth2/token";
const CLIENT_ID = "75c0c396b66f907627367d20588468a4";
const CLIENT_SECRET = "dde4deae619d572ed60596eee7157a55";
const SECURITY_TOKEN = "kU7JOyKi";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface LoginError {
  error: string;
  error_description: string;
}

// 登录获取access_token
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const params = new URLSearchParams({
    grant_type: "password",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    username: credentials.username,
    password: credentials.password + SECURITY_TOKEN
  });

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });

  if (!response.ok) {
    const errorData: LoginError = await response.json();
    throw new Error(errorData.error_description || "登录失败");
  }

  const data: LoginResponse = await response.json();
  return data;
}

// 保存token到localStorage
export function saveToken(token: string): void {
  localStorage.setItem("access_token", token);
}

// 保存用户名到localStorage
export function saveUsername(username: string): void {
  localStorage.setItem("username", username);
}

// 从localStorage获取token
export function getToken(): string | null {
  return localStorage.getItem("access_token");
}

// 从localStorage获取用户名
export function getUsername(): string | null {
  return localStorage.getItem("username");
}

// 清除token和用户名
export function clearToken(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("username");
}

// 检查是否已登录
export function isLoggedIn(): boolean {
  return getToken() !== null;
}

// 获取Authorization header
export function getAuthHeader(): string | null {
  const token = getToken();
  return token ? `Bearer ${token}` : null;
}
