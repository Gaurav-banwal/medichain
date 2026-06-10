import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'medichain-fallback-super-secret-key';

/**
 * Signs a payload to create a JWT token.
 * @param payload - The data to embed in the token.
 * @param expiresIn - Token expiration time (default: '1d').
 * @returns Signed JWT string.
 */
export function signToken(payload: object, expiresIn: jwt.SignOptions['expiresIn'] = '1d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}


/**
 * Verifies a JWT token and returns the decoded payload.
 * @param token - The JWT string to verify.
 * @returns Decoded payload of type T.
 * @throws Error if the token is invalid or expired.
 */
export function verifyToken<T extends object>(token: string): T {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as T;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw error;
  }
}
