"use client"

import { AuthGuard } from "@/components/auth-guard"
import React, { useState, useEffect, useCallback } from "react"
import {
  Plus, Search, Shield, ShieldCheck, UserCog, User as UserIcon, Trash2, Pencil, MoreVertical, Check, X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

type SafeUser = {
  id: string
  email: string
  name: string
  role: string
  status: string
  lastLogin?: string
  createdAt: string
}

const roleIcons: Record<string, React.ReactNode> = {
  super_admin: <ShieldCheck className="h-4 w-4" />,
  admin: <Shield className="h-4 w-4" />,
  manager: <UserCog className="h-4 w-4" />,
  crew: <UserIcon className="h-4 w-4" />,
  user: <UserIcon className="h-4 w-4" />,
}

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  manager: "Manager",
  crew: "Crew",
  user: "User",
}

const statusColors: Record<string, string> = {
  active: "text-accent border-accent",
  inactive: "text-muted-foreground border-muted-foreground",
  suspended: "text-destructive border-destructive",
}

export default function UsersPage() {
  return <AuthGuard><UsersContent /></AuthGuard>
}

function UsersContent() {
  const [users, setUsers] = useState<SafeUser[]>([])
  const [search, setSearch] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [editingUser, setEditingUser] = useState<SafeUser | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users")
      if (res.ok) setUsers(await res.json())
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleCreate = async (data: { name: string; email: string; password: string; role: string }) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        await fetchUsers()
        setShowCreate(false)
      }
    } catch { /* ignore */ }
  }

  const handleUpdate = async (id: string, data: Partial<{ name: string; role: string; status: string }>) => {
    try {
      await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      await fetchUsers()
      setEditingUser(null)
    } catch { /* ignore */ }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar este usuario?")) return
    try {
      await fetch(`/api/users/${id}`, { method: "DELETE" })
      await fetchUsers()
    } catch { /* ignore */ }
  }

  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.role.includes(search.toLowerCase())
  )

  if (loading) return <div className="p-6 text-muted-foreground">Loading users...</div>

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground text-balance">Manage Users</h2>
          <p className="text-sm text-muted-foreground">Create and manage user accounts and roles.</p>
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground gap-1.5"><Plus className="h-4 w-4" />Add User</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card text-foreground">
            <DialogHeader><DialogTitle className="text-foreground">Create New User</DialogTitle></DialogHeader>
            <CreateUserForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, email, or role..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-muted-foreground">{users.length} users total</Badge>
          <Badge variant="outline" className="text-accent border-accent">{users.filter((u) => u.status === "active").length} active</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((user) => (
          <Card key={user.id} className="border-border">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                    {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs gap-1 text-foreground">
                      {roleIcons[user.role]}{roleLabels[user.role] || user.role}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${statusColors[user.status] || "text-muted-foreground"}`}>
                      {user.status}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4 text-muted-foreground" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingUser(user)}><Pencil className="h-3.5 w-3.5 mr-2" />Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(user.id)}><Trash2 className="h-3.5 w-3.5 mr-2" />Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {user.lastLogin && (
                <p className="text-[10px] text-muted-foreground mt-3 pt-2 border-t border-border">
                  Last login: {new Date(user.lastLogin).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <UserIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No users found.</p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="sm:max-w-[425px] bg-card text-foreground">
          <DialogHeader><DialogTitle className="text-foreground">Edit User</DialogTitle></DialogHeader>
          {editingUser && <EditUserForm user={editingUser} onSubmit={(data) => handleUpdate(editingUser.id, data)} onCancel={() => setEditingUser(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CreateUserForm({ onSubmit, onCancel }: {
  onSubmit: (data: { name: string; email: string; password: string; role: string }) => void
  onCancel: () => void
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("user")

  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="flex flex-col gap-2"><Label className="text-foreground">Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Smith" /></div>
      <div className="flex flex-col gap-2"><Label className="text-foreground">Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@company.com" /></div>
      <div className="flex flex-col gap-2"><Label className="text-foreground">Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 6 characters" /></div>
      <div className="flex flex-col gap-2">
        <Label className="text-foreground">Role</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="super_admin">Super Admin</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="crew">Crew</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel} className="bg-transparent text-foreground">Cancel</Button>
        <Button onClick={() => onSubmit({ name, email, password, role })} disabled={!name.trim() || !email.trim() || password.length < 4} className="bg-primary text-primary-foreground">Create User</Button>
      </DialogFooter>
    </div>
  )
}

function EditUserForm({ user, onSubmit, onCancel }: {
  user: SafeUser
  onSubmit: (data: { name: string; role: string; status: string }) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(user.name)
  const [role, setRole] = useState(user.role)
  const [status, setStatus] = useState(user.status)

  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="flex flex-col gap-2"><Label className="text-foreground">Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
      <div className="flex flex-col gap-2">
        <Label className="text-foreground">Role</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="super_admin">Super Admin</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="crew">Crew</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-foreground">Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel} className="bg-transparent text-foreground">Cancel</Button>
        <Button onClick={() => onSubmit({ name, role, status })} disabled={!name.trim()} className="bg-primary text-primary-foreground">Save Changes</Button>
      </DialogFooter>
    </div>
  )
}
