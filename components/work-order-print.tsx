// ============================================
// COMPONENTS/WORK-ORDER-PRINT.TSX
// ============================================
// 🆕 NUEVO
// Ubicación: CleanMasters2/components/work-order-print.tsx

import React from 'react'
import { format } from 'date-fns'

export function WorkOrderPrint({ appointment }: { appointment: any }) {
  return (
    <div className="print-work-order" style={{ maxWidth: '8.5in', margin: '0 auto', padding: '0.5in' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24pt', margin: 0 }}>AllClean Services</h1>
          <p>Professional Cleaning Solutions</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ fontSize: '16pt', margin: 0 }}>CLEAN-UP WORK ORDER</h2>
          <p>#{appointment.id.slice(-8).toUpperCase()}</p>
        </div>
      </div>

      <hr />

      <div style={{ marginBottom: '20px' }}>
        <h3>Client Information</h3>
        <p><strong>Name:</strong> {appointment.client.name}</p>
        <p><strong>Email:</strong> {appointment.client.email || 'N/A'}</p>
        <p><strong>Phone:</strong> {appointment.client.phone || 'N/A'}</p>
        <p><strong>Address:</strong> {appointment.address}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Service Details</h3>
        <p><strong>Date:</strong> {format(appointment.scheduledDate, 'EEEE, MMMM dd, yyyy')}</p>
        <p><strong>Time:</strong> {appointment.startTime} - {appointment.endTime}</p>
        <p><strong>Service Type:</strong> {appointment.serviceType || 'Standard Cleaning'}</p>
        {appointment.estimatedCost && <p><strong>Cost:</strong> ${appointment.estimatedCost.toFixed(2)}</p>}
      </div>

      {appointment.crew && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Assigned Crew: {appointment.crew.name}</h3>
          {appointment.crew.members.map((member: any) => (
            <div key={member.id} style={{ padding: '5px', borderBottom: '1px solid #eee' }}>
              <strong>{member.name}</strong> - {member.role} ({member.experience} cleanings)
            </div>
          ))}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h3>Task Checklist</h3>
        {appointment.tasks && appointment.tasks.map((task: string, i: number) => (
          <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
            <div style={{ width: '16px', height: '16px', border: '2px solid #000' }}></div>
            <span>{task}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div>
          <div style={{ borderBottom: '2px solid #000', height: '40px', marginBottom: '8px' }}></div>
          <p style={{ textAlign: 'center' }}><strong>Crew Supervisor Signature</strong></p>
        </div>
        <div>
          <div style={{ borderBottom: '2px solid #000', height: '40px', marginBottom: '8px' }}></div>
          <p style={{ textAlign: 'center' }}><strong>Client Signature</strong></p>
        </div>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center', borderTop: '1px solid #ccc', paddingTop: '15px' }}>
        <p>Thank you for choosing AllClean Services!</p>
      </div>
    </div>
  )
}
