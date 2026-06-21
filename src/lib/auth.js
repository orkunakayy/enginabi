const SECRET = process.env.SESSION_SECRET || "e9f9a7d32c4a45a698dc1c7423696f01c80b91e92d9d93e827b5e408d6c7b949";

// Helper to convert string to ArrayBuffer
function textEncode(str) {
  return new TextEncoder().encode(str);
}

// Convert ArrayBuffer to hex string
function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Get CryptoKey for HMAC
async function getCryptoKey() {
  const keyData = textEncode(SECRET);
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

// Sign a session payload (e.g. { username, expiresAt })
export async function signSession(payload) {
  const payloadStr = JSON.stringify(payload);
  const encodedPayload = btoa(unescape(encodeURIComponent(payloadStr)));
  
  const key = await getCryptoKey();
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    textEncode(encodedPayload)
  );
  
  const signatureHex = bufferToHex(signatureBuffer);
  return `${encodedPayload}.${signatureHex}`;
}

// Verify a session token and return the payload if valid
export async function verifySession(token) {
  if (!token) return null;
  
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  
  const [encodedPayload, signatureHex] = parts;
  
  try {
    const key = await getCryptoKey();
    
    // Reconstruct signature
    const payloadBytes = textEncode(encodedPayload);
    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      payloadBytes
    );
    const expectedSignatureHex = bufferToHex(signatureBuffer);
    
    if (signatureHex !== expectedSignatureHex) {
      return null;
    }
    
    const decodedPayloadStr = decodeURIComponent(escape(atob(encodedPayload)));
    const payload = JSON.parse(decodedPayloadStr);
    
    // Check expiration
    if (payload.expiresAt && Date.now() > payload.expiresAt) {
      return null;
    }
    
    return payload;
  } catch (e) {
    console.error("Session verification error:", e);
    return null;
  }
}
