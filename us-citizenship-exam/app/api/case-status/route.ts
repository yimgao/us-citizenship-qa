import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { receiptNumber } = await request.json();

    if (!receiptNumber || typeof receiptNumber !== 'string') {
      return NextResponse.json(
        { error: 'Receipt number is required' },
        { status: 400 }
      );
    }

    // Clean the receipt number: uppercase, remove spaces/hyphens
    const cleaned = receiptNumber.trim().toUpperCase().replace(/[\s-]/g, '');

    if (cleaned.length < 10 || cleaned.length > 15) {
      return NextResponse.json(
        { error: 'Invalid receipt number format. Expected 10-15 characters (e.g. MSC1234567890).' },
        { status: 400 }
      );
    }

    // USCIS Case Status API
    const url = 'https://egov.uscis.gov/casestatus/mycasestatus.do';
    const body = new URLSearchParams({ appReceiptNum: cleaned });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
      body: body.toString(),
    });

    const html = await response.text();

    // Parse the USCIS response HTML to extract case status
    let status = 'Status information not found.';
    let details = '';

    // Try to extract the status from the response
    const statusMatch = html.match(/<div class="rows text-center">\s*<h1>(.*?)<\/h1>/i)
      || html.match(/<div[^>]*class="[^"]*appointmentSec[^"]*"[^>]*>[\s\S]*?<h1>(.*?)<\/h1>/i)
      || html.match(/<h1[^>]*class="[^"]*text-center[^"]*"[^>]*>(.*?)<\/h1>/i);

    if (statusMatch) {
      status = statusMatch[1].trim();
    }

    // Try to extract details
    const detailsMatch = html.match(/<div class="rows text-center">\s*<p>(.*?)<\/p>/i)
      || html.match(/<p[^>]*>(.*?)<\/p>/i);

    if (detailsMatch) {
      details = detailsMatch[1]
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    }

    // Determine status type for UI styling
    let statusType: 'approved' | 'pending' | 'rejected' | 'unknown' = 'unknown';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('approv') || statusLower.includes('card was delivered') || statusLower.includes('new card is being produced')) {
      statusType = 'approved';
    } else if (statusLower.includes('deni') || statusLower.includes('reject') || statusLower.includes('refuse')) {
      statusType = 'rejected';
    } else if (statusLower.includes('receiv') || statusLower.includes('process') || statusLower.includes('review') || statusLower.includes('pending') || statusLower.includes('fingerprint') || statusLower.includes('interview') || statusLower.includes('case was') || statusLower.includes('we received')) {
      statusType = 'pending';
    }

    return NextResponse.json({
      receiptNumber: cleaned,
      status,
      details: details || 'No additional details available.',
      statusType,
      raw: html.substring(0, 500), // debug info
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to check case status: ${error.message}` },
      { status: 500 }
    );
  }
}
