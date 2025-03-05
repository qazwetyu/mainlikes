import { SignJWT, jwtVerify } from 'jose';

/**
 * Signs a JWT with the provided payload
 */
export async function signJwt(payload: Record<string, any>, expiresIn = '8h') {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'development-secret-key-change-me');
  
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

/**
 * Verifies a JWT token
 */
export async function verifyJwt(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'development-secret-key-change-me');
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return false;
  }
}

/**
 * Decodes a JWT token without verification
 */
export function decodeJwt(token: string) {
  try {
    // Basic decoding without verification - just parse the middle part
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
} 