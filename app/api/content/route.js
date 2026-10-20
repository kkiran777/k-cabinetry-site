import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const file = path.join(process.cwd(), 'content.json')

export async function GET() {
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({})
  }
}

export async function POST(req) {
  const body = await req.json()
  fs.writeFileSync(file, JSON.stringify(body, null, 2))
  return NextResponse.json({ ok: true })
}