import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { createClient } from "@supabase/supabase-js"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function POST(req: NextRequest) {
  try {
    const event = await req.json()

    // Use service role to read all user emails
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: users, error } = await supabase.auth.admin.listUsers()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const emails = users.users.map(u => u.email).filter(Boolean) as string[]
    if (emails.length === 0) return NextResponse.json({ message: "No users to notify" })

    const eventUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/events`

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; background: #0a0a0a; color: #e5e5e5; border-radius: 12px; overflow: hidden;">
        <div style="background: #16a34a; padding: 28px 32px;">
          <p style="margin: 0; font-size: 13px; color: #bbf7d0; letter-spacing: 0.08em; text-transform: uppercase;">GfG RIT Chapter</p>
          <h1 style="margin: 8px 0 0; font-size: 22px; font-weight: 700; color: #ffffff;">New Event: ${event.title}</h1>
        </div>
        <div style="padding: 28px 32px; background: #111111;">
          <p style="margin: 0 0 20px; color: #a3a3a3; font-size: 15px; line-height: 1.6;">${event.description}</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #737373; font-size: 13px; width: 110px;">📅 Date</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #e5e5e5; font-size: 14px; font-weight: 500;">${event.date}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #737373; font-size: 13px;">🕐 Time</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #e5e5e5; font-size: 14px; font-weight: 500;">${event.time}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #737373; font-size: 13px;">📍 Location</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #e5e5e5; font-size: 14px; font-weight: 500;">${event.location}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #737373; font-size: 13px;">🏷️ Type</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #e5e5e5; font-size: 14px; font-weight: 500;">${event.type}</td>
            </tr>
            ${event.is_team_event ? `<tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #737373; font-size: 13px;">👥 Format</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #e5e5e5; font-size: 14px; font-weight: 500;">Team Event (up to ${event.max_team_size} members)</td>
            </tr>` : ""}
            ${event.is_paid ? `<tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #737373; font-size: 13px;">💰 Fee</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #e5e5e5; font-size: 14px; font-weight: 500;">₹${event.fee_amount}</td>
            </tr>` : ""}
            <tr>
              <td style="padding: 10px 0; color: #737373; font-size: 13px;">🎟️ Seats</td>
              <td style="padding: 10px 0; color: #e5e5e5; font-size: 14px; font-weight: 500;">${event.max_attendees} spots available</td>
            </tr>
          </table>
          <div style="margin-top: 28px; text-align: center;">
            <a href="${eventUrl}" style="display: inline-block; background: #16a34a; color: #ffffff; text-decoration: none; padding: 13px 32px; border-radius: 8px; font-weight: 600; font-size: 15px;">Register Now →</a>
          </div>
        </div>
        <div style="padding: 16px 32px; background: #0a0a0a; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #525252;">GfG RIT · Rajalakshmi Institute of Technology, Chennai</p>
        </div>
      </div>
    `

    // Send in batches of 50 to avoid Gmail rate limits
    const batchSize = 50
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize)
      await transporter.sendMail({
        from: `"GfG RIT" <${process.env.GMAIL_USER}>`,
        bcc: batch.join(","),
        subject: `🚀 New Event: ${event.title} — GfG RIT`,
        html,
      })
    }

    return NextResponse.json({ message: `Notified ${emails.length} users` })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
