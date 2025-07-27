import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Clock, Plus, Edit, Trash2, BookOpen } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { useToast } from "@/hooks/use-toast"

interface ScheduleItem {
  id: string
  subject: string
  teacher: string
  day: string
  startTime: string
  endTime: string
  classroom: string
  color: string
}

const daysOfWeek = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
]

const colors = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'
]

const Schedule = () => {
  const [schedule, setSchedule] = useLocalStorage<ScheduleItem[]>('student-schedule', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null)
  const [formData, setFormData] = useState({
    subject: '',
    teacher: '',
    day: '',
    startTime: '',
    endTime: '',
    classroom: '',
    color: colors[0]
  })
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingItem) {
      const updatedSchedule = schedule.map(item =>
        item.id === editingItem.id
          ? { ...formData, id: editingItem.id }
          : item
      )
      setSchedule(updatedSchedule)
      toast({
        title: "Horario actualizado",
        description: "Los cambios han sido guardados."
      })
    } else {
      const newItem: ScheduleItem = {
        ...formData,
        id: Date.now().toString()
      }
      setSchedule([...schedule, newItem])
      toast({
        title: "Clase agregada",
        description: "Nueva clase añadida al horario."
      })
    }

    setIsDialogOpen(false)
    setEditingItem(null)
    setFormData({
      subject: '',
      teacher: '',
      day: '',
      startTime: '',
      endTime: '',
      classroom: '',
      color: colors[0]
    })
  }

  const handleEdit = (item: ScheduleItem) => {
    setEditingItem(item)
    setFormData(item)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setSchedule(schedule.filter(item => item.id !== id))
    toast({
      title: "Clase eliminada",
      description: "La clase ha sido eliminada del horario.",
      variant: "destructive"
    })
  }

  const getScheduleForDay = (day: string) => {
    return schedule
      .filter(item => item.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Clock className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Horarios</h1>
            <p className="text-muted-foreground">Gestiona tu horario de clases</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Clase
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Editar Clase' : 'Nueva Clase'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Materia"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                required
              />
              <Input
                placeholder="Profesor"
                value={formData.teacher}
                onChange={(e) => setFormData({...formData, teacher: e.target.value})}
                required
              />
              <Select value={formData.day} onValueChange={(value) => setFormData({...formData, day: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Día de la semana" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map(day => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="time"
                  placeholder="Hora inicio"
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  required
                />
                <Input
                  type="time"
                  placeholder="Hora fin"
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  required
                />
              </div>
              <Input
                placeholder="Aula/Salón"
                value={formData.classroom}
                onChange={(e) => setFormData({...formData, classroom: e.target.value})}
                required
              />
              <div className="flex gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.color === color ? 'border-foreground' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({...formData, color})}
                  />
                ))}
              </div>
              <Button type="submit" className="w-full">
                {editingItem ? 'Actualizar' : 'Agregar'} Clase
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {daysOfWeek.map(day => (
          <Card key={day}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {day}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getScheduleForDay(day).length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Sin clases
                </p>
              ) : (
                <div className="space-y-3">
                  {getScheduleForDay(day).map(item => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg border"
                      style={{ borderLeftColor: item.color, borderLeftWidth: 4 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{item.subject}</h4>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {item.teacher}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {item.startTime} - {item.endTime}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        📍 {item.classroom}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Schedule