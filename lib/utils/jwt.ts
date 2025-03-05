import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret-fallback-key-for-development-only';
const encoder = new TextEncoder();
const secretKey = encoder.encode(JWT_SECRET);

export async function signJwt(payload: Record<string, any>, expiresIn = '8h') {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretKey);
  
  return jwt;
}

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as Record<string, any>;
  } catch (error) {
    return null;
  }
}

export function decodeJwt(token: string) {
  try {
    // Simple decode without verification
    const base64Payload = token.split('.')[1];
    const payload = Buffer.from(base64Payload, 'base64').toString('utf8');
    return JSON.parse(payload) as Record<string, any>;
  } catch (error) {
    return null;
  }
} 