const REGION = process.env.NEXT_PUBLIC_COGNITO_REGION;
const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;

export const authEnabled = Boolean(REGION && CLIENT_ID);

const ENDPOINT = `https://cognito-idp.${REGION}.amazonaws.com/`;
const STORAGE_KEY = "cloudpulse.auth";

async function cognito(action, body) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-amz-json-1.1",
      "X-Amz-Target": `AWSCognitoIdentityProviderService.${action}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (data.message || data.__type || "Request failed")
      .replace("Exception", "")
      .replace(/([a-z])([A-Z])/g, "$1 $2");
    throw new Error(message);
  }
  return data;
}

export async function signUp({ name, email, password }) {
  return cognito("SignUp", {
    ClientId: CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: [
      { Name: "email", Value: email },
      ...(name ? [{ Name: "name", Value: name }] : []),
    ],
  });
}

export async function confirmSignUp(email, code) {
  return cognito("ConfirmSignUp", {
    ClientId: CLIENT_ID,
    Username: email,
    ConfirmationCode: code,
  });
}

export async function resendCode(email) {
  return cognito("ResendConfirmationCode", { ClientId: CLIENT_ID, Username: email });
}

export async function signIn(email, password) {
  const data = await cognito("InitiateAuth", {
    ClientId: CLIENT_ID,
    AuthFlow: "USER_PASSWORD_AUTH",
    AuthParameters: { USERNAME: email, PASSWORD: password },
  });
  const result = data.AuthenticationResult;
  if (!result?.IdToken) throw new Error("Sign in failed, no token returned.");

  const claims = decodeJwt(result.IdToken);
  const session = {
    idToken: result.IdToken,
    refreshToken: result.RefreshToken,
    expiresAt: Date.now() + (result.ExpiresIn || 3600) * 1000,
    email: claims.email || email,
    name: claims.name || (claims.email || email).split("@")[0],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("cloudpulse-auth"));
  return session;
}

export function signOut() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("cloudpulse-auth"));
}

export function currentUser() {
  if (typeof window === "undefined") return null;
  try {
    const session = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!session) return null;
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function getIdToken() {
  return currentUser()?.idToken || null;
}

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return {};
  }
}
