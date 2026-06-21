import { NextResponse } from 'next/server';
import { readDB } from '../../../../../lib/db';

function verifyAdminSession(request) {
  const sessionCookie = request.cookies.get('admin_session')?.value;
  if (!sessionCookie) return false;

  const db = readDB();
  const session = db.admin.sessions?.[sessionCookie];
  if (!session) return false;

  if (new Date(session.expiresAt) < new Date()) {
    return false;
  }
  return true;
}

// Helper to extract Youtube Video ID from any youtube url (shorts, watch, share links)
function extractYoutubeId(url) {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.length === 11) return trimmed; // already an ID

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);
  return (match && match[2].length === 11) ? match[2] : trimmed;
}

// Helper to parse ISO 8601 duration (e.g. PT15M10S or PT4M)
function parseDuration(isoDuration) {
  if (!isoDuration) return '10:00';
  const timeRegex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = isoDuration.match(timeRegex);
  if (!matches) return '10:00';

  const hours = parseInt(matches[1] || '0', 10);
  const minutes = parseInt(matches[2] || '0', 10);
  const seconds = parseInt(matches[3] || '0', 10);

  const secStr = seconds < 10 ? `0${seconds}` : seconds;

  if (hours > 0) {
    const minStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minStr}:${secStr}`;
  }
  
  return `${minutes}:${secStr}`;
}

export async function GET(request) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Link parametresi eksik' }, { status: 400 });
  }

  const youtubeId = extractYoutubeId(url);
  if (!youtubeId || youtubeId.length !== 11) {
    return NextResponse.json({ error: 'Geçersiz YouTube linki veya Video ID' }, { status: 400 });
  }

  try {
    // Fetch the YouTube page HTML
    const response = await fetch(`https://www.youtube.com/watch?v=${youtubeId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error('YouTube sayfası yüklenemedi');
    }

    const html = await response.text();

    // 1. Extract title
    let title = '';
    const titleMatch = html.match(/<meta\s+name="title"\s+content="([^"]+)"/) || 
                       html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/) ||
                       html.match(/<title>(.*?) - YouTube<\/title>/) ||
                       html.match(/<title>(.*?)<\/title>/);
    if (titleMatch) {
      // Decode HTML entities briefly if needed, but standard regex match holds raw string
      title = titleMatch[1].replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
    }

    // 2. Extract Duration (ISO 8601 format PTxxMxxS)
    let duration = '0:45';
    const durationMatch = html.match(/<meta\s+itemprop="duration"\s+content="([^"]+)"/);
    if (durationMatch) {
      duration = parseDuration(durationMatch[1]);
    }

    // 3. Extract Views to calculate likes
    let likes = '120';
    const viewsMatch = html.match(/<meta\s+itemprop="interactionCount"\s+content="([^"]+)"/);
    if (viewsMatch) {
      const views = parseInt(viewsMatch[1], 10);
      if (!isNaN(views)) {
        // Assume roughly 5-10% of views are likes, capped at a nice clean formatted string
        const calculatedLikes = Math.max(50, Math.floor(views * 0.065));
        if (calculatedLikes > 1000) {
          likes = (calculatedLikes / 1000).toFixed(1) + 'K';
        } else {
          likes = String(calculatedLikes);
        }
      }
    }

    const thumbnail = `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;

    return NextResponse.json({
      success: true,
      title,
      youtubeId,
      duration,
      likes,
      thumbnail
    });
  } catch (err) {
    console.error("Failed to fetch YouTube metadata:", err);
    // Fallback: Return resolved ID and defaults if scraping fails
    return NextResponse.json({
      success: true,
      title: 'YouTube Videosu',
      youtubeId,
      duration: '10:00',
      likes: '150',
      thumbnail: `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
    });
  }
}
