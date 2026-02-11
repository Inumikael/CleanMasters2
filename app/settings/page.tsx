"use client"

import { AuthGuard } from "@/components/auth-guard"
import React, { useState, useEffect } from "react"
import { Save, Building2, Clock, Bell, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useAppState } from "@/lib/app-context"

export default function SettingsPage() {
  return <AuthGuard><SettingsContent /></AuthGuard>
}

function SettingsContent() {
  const { settings, updateSettings, changePassword, user } = useAppState()
  const [form, setForm] = useState(settings)
  const [saved, setSaved] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" })
  const [passwordMsg, setPasswordMsg] = useState("")

  useEffect(() => {
    if (settings) setForm(settings)
  }, [settings])

  const handleSave = async () => {
    if (!form) return
    await updateSettings(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleChangePassword = async () => {
    setPasswordMsg("")
    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordMsg("Las contrasenas no coinciden.")
      return
    }
    if (passwordForm.new.length < 4) {
      setPasswordMsg("La contrasena debe tener al menos 4 caracteres.")
      return
    }
    try {
      await changePassword(passwordForm.current, passwordForm.new)
      setPasswordMsg("Contrasena actualizada correctamente.")
      setPasswordForm({ current: "", new: "", confirm: "" })
    } catch {
      setPasswordMsg("Error: contrasena actual incorrecta.")
    }
  }

  if (!form) return <div className="p-6 text-muted-foreground">Loading settings...</div>

  return (
    <div className="p-6 flex flex-col gap-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground text-balance">Settings</h2>
        <p className="text-sm text-muted-foreground">Configure your business preferences and notifications.</p>
      </div>

      {/* Business Info */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-semibold text-foreground">Business Information</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">Your company profile and contact details.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2"><Label className="text-foreground">Business Name</Label><Input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} /></div>
            <div className="flex flex-col gap-2"><Label className="text-foreground">Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="flex flex-col gap-2"><Label className="text-foreground">Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="flex flex-col gap-2"><Label className="text-foreground">Service Area</Label><Input value={form.serviceArea} onChange={(e) => setForm({ ...form, serviceArea: e.target.value })} /></div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Settings */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-semibold text-foreground">Schedule Settings</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">Work hours and buffer time between appointments.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Work Start Hour</Label>
              <Input type="number" min={0} max={23} value={form.workStartHour} onChange={(e) => setForm({ ...form, workStartHour: parseInt(e.target.value, 10) || 0 })} />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Work End Hour</Label>
              <Input type="number" min={0} max={23} value={form.workEndHour} onChange={(e) => setForm({ ...form, workEndHour: parseInt(e.target.value, 10) || 0 })} />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Buffer (min)</Label>
              <Input type="number" min={0} value={form.bufferMinutes} onChange={(e) => setForm({ ...form, bufferMinutes: parseInt(e.target.value, 10) || 0 })} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-foreground">Auto-Optimize Schedule</Label>
              <p className="text-xs text-muted-foreground">Automatically fill gaps in crew schedules.</p>
            </div>
            <Switch checked={form.autoOptimize} onCheckedChange={(v) => setForm({ ...form, autoOptimize: v })} />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-semibold text-foreground">Notifications</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">Configure what notifications you receive.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between"><div><Label className="text-foreground">New Booking</Label><p className="text-xs text-muted-foreground">Notify when a new appointment is booked.</p></div><Switch checked={form.notifyNewBooking} onCheckedChange={(v) => setForm({ ...form, notifyNewBooking: v })} /></div>
          <Separator />
          <div className="flex items-center justify-between"><div><Label className="text-foreground">Crew Status</Label><p className="text-xs text-muted-foreground">Notify when crew starts or finishes a job.</p></div><Switch checked={form.notifyCrewStatus} onCheckedChange={(v) => setForm({ ...form, notifyCrewStatus: v })} /></div>
          <Separator />
          <div className="flex items-center justify-between"><div><Label className="text-foreground">Schedule Conflicts</Label><p className="text-xs text-muted-foreground">Notify when overlapping appointments are detected.</p></div><Switch checked={form.notifyConflicts} onCheckedChange={(v) => setForm({ ...form, notifyConflicts: v })} /></div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="bg-primary text-primary-foreground w-fit gap-1.5">
        <Save className="h-4 w-4" />{saved ? "Saved!" : "Save Settings"}
      </Button>

      {/* Change Password */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-semibold text-foreground">Change Password</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">Update your account password.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2"><Label className="text-foreground">Current Password</Label><Input type="password" value={passwordForm.current} onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })} /></div>
            <div className="flex flex-col gap-2"><Label className="text-foreground">New Password</Label><Input type="password" value={passwordForm.new} onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })} /></div>
            <div className="flex flex-col gap-2"><Label className="text-foreground">Confirm Password</Label><Input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} /></div>
          </div>
          {passwordMsg && <p className={`text-sm ${passwordMsg.includes("Error") ? "text-destructive" : "text-accent"}`}>{passwordMsg}</p>}
          <Button onClick={handleChangePassword} variant="outline" className="w-fit bg-transparent text-foreground" disabled={!passwordForm.current || !passwordForm.new}>Change Password</Button>
        </CardContent>
      </Card>
    </div>
  )
}
