// ============================================
// LIB/EMAIL-SERVICE.TS
// ============================================
// 🆕 NUEVO - Copiar a: CleanMasters2/lib/email-service.ts

import nodemailer from 'nodemailer'
import { formatTime12Hour } from './time-utils'
import { format } from 'date-fns'

interface EmailConfig {
  host: string
  port: number
  user: string
  password: string
  from: string
}

export async function sendCompletionEmail(
  appointment: any,
  emailConfig: EmailConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = nodemailer.createTransporter({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.port === 465,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.password,
      },
    })

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
    .content { background: #f9f9f9; padding: 20px; }
    .section { margin-bottom: 20px; background: white; padding: 15px; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✓ Cleaning Service Completed</h1>
    </div>
    <div class="content">
      <div class="section">
        <h2>Service Details</h2>
        <p><strong>Client:</strong> ${appointment.client.name}</p>
        <p><strong>Date:</strong> ${format(appointment.scheduledDate, 'EEEE, MMMM dd, yyyy')}</p>
        <p><strong>Time:</strong> ${formatTime12Hour(appointment.startTime)} - ${formatTime12Hour(appointment.endTime)}</p>
        <p><strong>Location:</strong> ${appointment.address}</p>
      </div>
      <div class="section">
        <h2>Tasks Completed</h2>
        <ul>
          ${appointment.tasks.map((task: string) => `<li>${task}</li>`).join('')}
        </ul>
      </div>
      ${appointment.estimatedCost ? `
        <div class="section">
          <h2>Service Cost</h2>
          <p style="font-size: 24px; font-weight: bold;">$${appointment.estimatedCost.toFixed(2)}</p>
        </div>
      ` : ''}
    </div>
  </div>
</body>
</html>
    `

    await transporter.sendMail({
      from: emailConfig.from,
      to: appointment.client.email,
      subject: `Cleaning Service Completed - ${appointment.client.name}`,
      html: htmlContent,
    })

    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function testEmailConfig(config: EmailConfig): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = nodemailer.createTransporter({
      host: config.host,
      port: config.port,
      auth: {
        user: config.user,
        pass: config.password,
      },
    })
    await transporter.verify()
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
