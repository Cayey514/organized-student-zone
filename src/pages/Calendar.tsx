import { useState } from "react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { Task } from "@/components/TaskCard"

const Calendar = () => {
  const [tasks] = useLocalStorage<Task[]>('student-tasks', [])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Get tasks for the selected date
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate)
      return taskDate.toDateString() === date.toDateString()
    })
  }

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : []

  // Get dates that have tasks
  const getDatesWithTasks = () => {
    return tasks.map(task => new Date(task.dueDate))
  }

  const datesWithTasks = getDatesWithTasks()

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex items-center gap-3 mb-8">
        <CalendarIcon className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendario</h1>
          <p className="text-muted-foreground">Visualiza tus tareas por fecha</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Calendario de Tareas</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border p-3 pointer-events-auto"
              modifiers={{
                hasTask: datesWithTasks,
              }}
              modifiersClassNames={{
                hasTask: "bg-primary/20 text-primary font-semibold",
              }}
            />
          </CardContent>
        </Card>

        {/* Tasks for selected date */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {selectedDate ? selectedDate.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'Selecciona una fecha'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateTasks.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No hay tareas para esta fecha
              </p>
            ) : (
              <div className="space-y-3">
                {selectedDateTasks.map(task => (
                  <div key={task.id} className="p-3 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <Badge 
                        variant={
                          task.priority === 'high' ? 'destructive' :
                          task.priority === 'medium' ? 'default' : 'secondary'
                        }
                      >
                        {task.priority === 'high' ? 'Alta' :
                         task.priority === 'medium' ? 'Media' : 'Baja'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {task.subject}
                    </p>
                    {task.description && (
                      <p className="text-xs text-muted-foreground">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-2">
                      <Badge variant={task.completed ? "default" : "outline"}>
                        {task.completed ? "Completada" : "Pendiente"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Calendar