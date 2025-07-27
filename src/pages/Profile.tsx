import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, BookOpen, Calendar, Target, Edit3, Save, GraduationCap } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { useToast } from "@/hooks/use-toast"
import { Task } from "@/components/TaskCard"

interface UserProfile {
  name: string
  email: string
  avatar: string
  bio: string
  institution: string
  career: string
  semester: string
  goals: string[]
}

const Profile = () => {
  const [profile, setProfile] = useLocalStorage<UserProfile>('user-profile', {
    name: '',
    email: '',
    avatar: '',
    bio: '',
    institution: '',
    career: '',
    semester: '',
    goals: []
  })
  
  const [tasks] = useLocalStorage<Task[]>('student-tasks', [])
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState(profile)
  const [newGoal, setNewGoal] = useState('')
  const { toast } = useToast()

  const handleSave = () => {
    setProfile(editForm)
    setIsEditing(false)
    toast({
      title: "Perfil actualizado",
      description: "Los cambios han sido guardados exitosamente."
    })
  }

  const addGoal = () => {
    if (newGoal.trim()) {
      setEditForm({
        ...editForm,
        goals: [...editForm.goals, newGoal.trim()]
      })
      setNewGoal('')
    }
  }

  const removeGoal = (index: number) => {
    setEditForm({
      ...editForm,
      goals: editForm.goals.filter((_, i) => i !== index)
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Estadísticas del usuario
  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length
  const subjects = [...new Set(tasks.map(task => task.subject))].length

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <User className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
            <p className="text-muted-foreground">Gestiona tu información personal</p>
          </div>
        </div>
        
        <Button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          variant={isEditing ? "default" : "outline"}
          className="gap-2"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4" />
              Guardar
            </>
          ) : (
            <>
              <Edit3 className="h-4 w-4" />
              Editar
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nombre Completo</Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Biografía</Label>
                    <Textarea
                      id="bio"
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      placeholder="Cuéntanos un poco sobre ti..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="institution">Institución</Label>
                      <Input
                        id="institution"
                        value={editForm.institution}
                        onChange={(e) => setEditForm({...editForm, institution: e.target.value})}
                        placeholder="Universidad/Colegio"
                      />
                    </div>
                    <div>
                      <Label htmlFor="career">Carrera</Label>
                      <Input
                        id="career"
                        value={editForm.career}
                        onChange={(e) => setEditForm({...editForm, career: e.target.value})}
                        placeholder="Tu carrera"
                      />
                    </div>
                    <div>
                      <Label htmlFor="semester">Semestre</Label>
                      <Input
                        id="semester"
                        value={editForm.semester}
                        onChange={(e) => setEditForm({...editForm, semester: e.target.value})}
                        placeholder="1er semestre"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  {profile.name ? (
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={profile.avatar} />
                        <AvatarFallback className="text-lg">
                          {getInitials(profile.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">{profile.name}</h3>
                        {profile.email && (
                          <p className="text-muted-foreground flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {profile.email}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No has configurado tu perfil aún.</p>
                      <p className="text-sm">Haz clic en "Editar" para comenzar.</p>
                    </div>
                  )}

                  {profile.bio && (
                    <div>
                      <h4 className="font-medium mb-2">Biografía</h4>
                      <p className="text-muted-foreground">{profile.bio}</p>
                    </div>
                  )}

                  {(profile.institution || profile.career || profile.semester) && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Información Académica
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        {profile.institution && (
                          <div>
                            <span className="text-muted-foreground">Institución:</span>
                            <br />
                            <span>{profile.institution}</span>
                          </div>
                        )}
                        {profile.career && (
                          <div>
                            <span className="text-muted-foreground">Carrera:</span>
                            <br />
                            <span>{profile.career}</span>
                          </div>
                        )}
                        {profile.semester && (
                          <div>
                            <span className="text-muted-foreground">Semestre:</span>
                            <br />
                            <span>{profile.semester}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Mis Metas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      placeholder="Nueva meta..."
                      onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                    />
                    <Button onClick={addGoal} size="sm">Agregar</Button>
                  </div>
                  <div className="space-y-2">
                    {editForm.goals.map((goal, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span>{goal}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeGoal(index)}
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {profile.goals.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No has definido metas aún.
                    </p>
                  ) : (
                    profile.goals.map((goal, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded">
                        <Target className="h-4 w-4 text-primary" />
                        <span>{goal}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Estadísticas */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{completedTasks}</div>
                <div className="text-sm text-muted-foreground">Tareas Completadas</div>
              </div>
              <Separator />
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{totalTasks}</div>
                <div className="text-sm text-muted-foreground">Tareas Totales</div>
              </div>
              <Separator />
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{subjects}</div>
                <div className="text-sm text-muted-foreground">Materias Activas</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No hay actividad reciente.
                </p>
              ) : (
                <div className="space-y-2">
                  {tasks.slice(0, 5).map(task => (
                    <div key={task.id} className="flex items-center justify-between text-sm">
                      <span className="truncate">{task.title}</span>
                      <Badge variant={task.completed ? "default" : "secondary"}>
                        {task.completed ? "✓" : "⏳"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile