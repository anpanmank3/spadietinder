// app/api/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 必要に応じてバリデーション
    if (!body.nickname || !body.twitter) {
      return NextResponse.json(
        { ok: false, error: 'nickname と twitter は必須です' },
        { status: 400 }
      );
    }

    const scriptUrl = process.env.APPS_SCRIPT_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbzwBpxF9knS7__BCmpjkpMXfr2b0_sSzFi8dDSMb_lL3ooDxNG4PqGCRGVspnUSsoClJQ/exec

    if (!scriptUrl) {
      console.error('APPS_SCRIPT_WEBHOOK_URL is not set');
      return NextResponse.json(
        { ok: false, error: 'サーバー設定エラー: APPS_SCRIPT_WEBHOOK_URL が未設定です' },
        { status: 500 }
      );
    }

    // Apps Script にサーバー側から POST
    const res = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const text = await res.text();
    let scriptResponse: any = {};
    try {
      scriptResponse = JSON.parse(text);
    } catch {
      scriptResponse = { raw: text };
    }

    if (!res.ok || scriptResponse.ok === false) {
      console.error('Apps Script error:', res.status, scriptResponse);
      return NextResponse.json(
        { ok: false, error: 'スプレッドシートへの書き込みに失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, scriptResponse });
  } catch (err) {
    console.error('Submit API error:', err);
    return NextResponse.json(
      { ok: false, error: 'サーバー内部エラーが発生しました' },
      { status: 500 }
    );
  }
}
