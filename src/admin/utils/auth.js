const ADMIN_EMAIL = "admin@arabianestate.com";
const ADMIN_PASSWORD = "securepassword123"; 

// Simulate a JWT (normally issued by a backend)
export function generateToken() {
  const payload = {
    email: ADMIN_EMAIL,
    exp: Date.now() + 6 * 24 * 60 * 60 * 1000, // 6 days from now (in ms)
  };
  return btoa(JSON.stringify(payload)); // simple base64 encoding (not secure for production)
}

export function saveToken(token) {
  localStorage.setItem("jwt_token", token);
}

export function getToken() {
  return localStorage.getItem("jwt_token");
}

export function removeToken() {
  localStorage.removeItem("jwt_token");
}

export function isTokenValid() {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token));
    return payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function checkCredentials(email, password) {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}
