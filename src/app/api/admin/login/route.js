import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { readDB, writeDB } from '../../../../lib/db';
import { signSession } from '../../../../lib/auth';

// Simple in-memory login rate limiter
const failedLogins = new Map(); // ip -> { count, resetTime }

const LIMIT_ATTEMPTS = 5;
const LOCKOUT_WINDOW = 15 * 60 * 1000; // 15 minutes

export async function POST(request) {
  try {
    // Get client IP address
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1';

    // Check rate limit
    const now = Date.now();
    const limit = failedLogins.get(ip);

    if (limit && now < limit.resetTime) {
      if (limit.count >= LIMIT_ATTEMPTS) {
        return NextResponse.json(
          { error: 'Çok fazla başarısız deneme yaptınız. Lütfen 15 dakika sonra tekrar deneyin.' },
          { status: 429 }
        );
      }
    } else if (limit && now >= limit.resetTime) {
      // Reset window expired
      failedLogins.delete(ip);
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 });
    }

    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Kullanıcı adı ve şifre gereklidir.' }, { status: 400 });
    }

    const db = readDB();

    // Validate credentials (enforce generic failure message to prevent username enumeration)
    const isUsernameValid = username.trim() === db.admin.username;
    const isPasswordValid = isUsernameValid ? bcrypt.compareSync(password, db.admin.passwordHash) : false;

    if (!isUsernameValid || !isPasswordValid) {
      // Increment failed attempt counter
      const currentLimit = failedLogins.get(ip) || { count: 0, resetTime: now + LOCKOUT_WINDOW };
      currentLimit.count += 1;
      failedLogins.set(ip, currentLimit);

      return NextResponse.json({ error: 'Geçersiz kullanıcı adı veya şifre.' }, { status: 401 });
    }

    // Clear rate limits on success
    failedLogins.delete(ip);

    // Generate stateless token with 24 hours expiry
    const expiryTime = now + 24 * 60 * 60 * 1000;
    const token = await signSession({
      username: db.admin.username,
      expiresAt: expiryTime
    });

    const response = NextResponse.json({ 
      success: true, 
      mustChangePassword: db.admin.mustChangePassword 
    });

    // Set secure session cookie
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 // 24 hours in seconds
    });

    return response;
  } catch (err) {
    console.error("Critical Login Error:", err);
    return NextResponse.json({ error: 'Sunucuda giriş işlemi gerçekleştirilirken bir hata oluştu.' }, { status: 500 });
  }
}
