import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, Zap, Calendar, BookOpen, CheckCircle, Award, Star } from "lucide-react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { Task } from "@/components/TaskCard"

interface Achievement {
  id: string
  title: string
  description: string
  icon: any
  category: 'tasks' | 'consistency' | 'subjects' | 'speed'
  threshold: number
  current: number
  unlocked: boolean
  unlockedAt?: string
}

const Achievements = () => {
  const [tasks] = useLocalStorage<Task[]>('student-tasks', [])

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(task => task.completed)
    const totalTasks = tasks.length
    const subjects = [...new Set(tasks.map(task => task.subject))]
    
    // Calcular racha (tareas completadas en días consecutivos)
    const completedDates = completedTasks
      .map(task => new Date(task.dueDate).toDateString())
      .sort()
    
    let currentStreak = 0
    let maxStreak = 0
    const today = new Date().toDateString()
    
    // Simplified streak calculation
    const last7Days = Array.from({length: 7}, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toDateString()
    })
    
    const completedInLast7Days = last7Days.filter(date => 
      completedDates.includes(date)
    ).length
    
    currentStreak = completedInLast7Days
    maxStreak = Math.max(currentStreak, completedInLast7Days)

    return {
      totalCompleted: completedTasks.length,
      totalTasks,
      completionRate: totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0,
      subjectsCount: subjects.length,
      currentStreak,
      maxStreak,
      highPriorityCompleted: completedTasks.filter(task => task.priority === 'high').length
    }
  }, [tasks])

  const achievements: Achievement[] = [
    // Logros de tareas
    {
      id: 'first-task',
      title: 'Primera Tarea',
      description: 'Completa tu primera tarea',
      icon: CheckCircle,
      category: 'tasks',
      threshold: 1,
      current: stats.totalCompleted,
      unlocked: stats.totalCompleted >= 1
    },
    {
      id: 'task-master',
      title: 'Maestro de Tareas',
      description: 'Completa 10 tareas',
      icon: Trophy,
      category: 'tasks',
      threshold: 10,
      current: stats.totalCompleted,
      unlocked: stats.totalCompleted >= 10
    },
    {
      id: 'task-legend',
      title: 'Leyenda de Tareas',
      description: 'Completa 50 tareas',
      icon: Award,
      category: 'tasks',
      threshold: 50,
      current: stats.totalCompleted,
      unlocked: stats.totalCompleted >= 50
    },
    
    // Logros de consistencia
    {
      id: 'streak-3',
      title: 'Racha de 3',
      description: 'Completa tareas por 3 días seguidos',
      icon: Zap,
      category: 'consistency',
      threshold: 3,
      current: stats.currentStreak,
      unlocked: stats.currentStreak >= 3
    },
    {
      id: 'streak-7',
      title: 'Semana Perfecta',
      description: 'Completa tareas por 7 días seguidos',
      icon: Calendar,
      category: 'consistency',
      threshold: 7,
      current: stats.currentStreak,
      unlocked: stats.currentStreak >= 7
    },
    
    // Logros de materias
    {
      id: 'multi-subject',
      title: 'Estudiante Versátil',
      description: 'Crea tareas en 3 materias diferentes',
      icon: BookOpen,
      category: 'subjects',
      threshold: 3,
      current: stats.subjectsCount,
      unlocked: stats.subjectsCount >= 3
    },
    {
      id: 'subject-master',
      title: 'Maestro Multidisciplinar',
      description: 'Crea tareas en 5 materias diferentes',
      icon: Star,
      category: 'subjects',
      threshold: 5,
      current: stats.subjectsCount,
      unlocked: stats.subjectsCount >= 5
    },
    
    // Logros de eficiencia
    {
      id: 'efficient',
      title: 'Estudiante Eficiente',
      description: 'Mantén 80% de tareas completadas',
      icon: Target,
      category: 'speed',
      threshold: 80,
      current: Math.round(stats.completionRate),
      unlocked: stats.completionRate >= 80
    },
    {
      id: 'priority-master',
      title: 'Maestro de Prioridades',
      description: 'Completa 5 tareas de alta prioridad',
      icon: Award,
      category: 'speed',
      threshold: 5,
      current: stats.highPriorityCompleted,
      unlocked: stats.highPriorityCompleted >= 5
    }
  ]

  const unlockedAchievements = achievements.filter(a => a.unlocked)
  const lockedAchievements = achievements.filter(a => !a.unlocked)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tasks': return 'bg-blue-500/10 text-blue-600 border-blue-200'
      case 'consistency': return 'bg-green-500/10 text-green-600 border-green-200'
      case 'subjects': return 'bg-purple-500/10 text-purple-600 border-purple-200'
      case 'speed': return 'bg-orange-500/10 text-orange-600 border-orange-200'
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200'
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'tasks': return 'Tareas'
      case 'consistency': return 'Consistencia'
      case 'subjects': return 'Materias'
      case 'speed': return 'Eficiencia'
      default: return 'General'
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex items-center gap-3 mb-8">
        <Trophy className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Logros</h1>
          <p className="text-muted-foreground">
            {unlockedAchievements.length} de {achievements.length} logros desbloqueados
          </p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{stats.totalCompleted}</div>
            <div className="text-sm text-muted-foreground">Tareas Completadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.currentStreak}</div>
            <div className="text-sm text-muted-foreground">Racha Actual</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.subjectsCount}</div>
            <div className="text-sm text-muted-foreground">Materias</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{Math.round(stats.completionRate)}%</div>
            <div className="text-sm text-muted-foreground">Tasa de Éxito</div>
          </CardContent>
        </Card>
      </div>

      {/* Logros Desbloqueados */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Award className="h-6 w-6" />
          Logros Desbloqueados ({unlockedAchievements.length})
        </h2>
        {unlockedAchievements.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                Aún no has desbloqueado ningún logro. ¡Completa algunas tareas para empezar!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievements.map(achievement => (
              <Card key={achievement.id} className="relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                    ✓ Completado
                  </Badge>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <achievement.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{achievement.title}</CardTitle>
                      <Badge className={getCategoryColor(achievement.category)}>
                        {getCategoryName(achievement.category)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {achievement.description}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    {achievement.current}/{achievement.threshold}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Logros Bloqueados */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Target className="h-6 w-6" />
          Próximos Logros ({lockedAchievements.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lockedAchievements.map(achievement => (
            <Card key={achievement.id} className="opacity-75">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <achievement.icon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-muted-foreground">
                      {achievement.title}
                    </CardTitle>
                    <Badge variant="outline" className={getCategoryColor(achievement.category)}>
                      {getCategoryName(achievement.category)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {achievement.description}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Progreso</span>
                    <span>{achievement.current}/{achievement.threshold}</span>
                  </div>
                  <Progress 
                    value={(achievement.current / achievement.threshold) * 100} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Achievements