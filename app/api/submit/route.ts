import { NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nickname, twitter, gameId, selections } = body

    console.log('[v0] Received submission:', { nickname, twitter, gameId, selections })

    // Validate required fields
    if (!nickname || !twitter || !gameId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

    if (!spreadsheetId) {
      console.error('[v0] Missing GOOGLE_SHEETS_SPREADSHEET_ID')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Create row data: [nickname, twitter, gameId, timestamp, ...user1-109 selections]
    const timestamp = new Date().toLocaleString('ja-JP', { 
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })

    // Initialize all 109 user columns as empty
    const userSelections = new Array(109).fill('')

    // Fill in the selections: 0=NO, 1=YES, 2=SUPERLIKE
    selections.forEach((selection: { userId: string; action: 'no' | 'like' | 'superlike' }) => {
      const userIndex = parseInt(selection.userId) - 1
      if (userIndex >= 0 && userIndex < 109) {
        if (selection.action === 'no') {
          userSelections[userIndex] = '0'
        } else if (selection.action === 'like') {
          userSelections[userIndex] = '1'
        } else if (selection.action === 'superlike') {
          userSelections[userIndex] = '2'
        }
      }
    })

    const rowData = [nickname, twitter, gameId, timestamp, ...userSelections]

    // Append to Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'シート1!A:DR', // A-DR columns (113 total)
      valueInputOption: 'RAW',
      requestBody: {
        values: [rowData],
      },
    })

    console.log('[v0] Successfully submitted to Google Sheets')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Error submitting to Google Sheets:', error)
    return NextResponse.json(
      { error: 'Failed to submit data' },
      { status: 500 }
    )
  }
}
