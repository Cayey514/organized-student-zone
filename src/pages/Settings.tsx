import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Settings as SettingsIcon, 
  Palette, 
  Bell, 
  Download, 
  Upload, 
  Trash2, 
  Shield, 
  Database,
  Moon,
  Sun,
  Monitor,
  Info
} from "lucide-react"
import { useTheme } from "@/components/ThemeProvider"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { useToast } from "@/hooks/use-toast"
import { Task } from "@/components/TaskCard"

interface AppSettings {
  notifications: boolean
  autoSave: boolean
  compactView: boolean
  showCompleted: boolean
  defaultPriority: 'low' | 'medium' | 'high'
  weekStartsOn: 'monday' | 'sunday'
}

const Settings = () => {
  const { theme, setTheme } = useTheme()
  const [tasks, setTasks] = useLocalStorage<Task[]>('student-tasks', [])
  const [settings, setSettings] = useLocalStorage<AppSettings>('app-settings', {
    notifications: true,
    autoSave: true,
    compactView: false,
    showCompleted: true,
    defaultPriority: 'medium',
    weekStartsOn: 'monday'
  })
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)

  const updateSetting = (key: keyof AppSettings, value: any) => {
    setSettings({ ...settings, [key]: value })
    toast({
      title: "Configuración actualizada",
      description: "Los cambios han sido guardados."
    })
  }

  const exportData = () => {
    setIsExporting(true)
    try {
      const data = {
        tasks,
        settings,
        exportDate: new Date().toISOString(),
        version: "1.0"
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `studyplanner-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({
        title: "Datos exportados",
        description: "Se ha descargado el archivo de respaldo."
      })
    } catch (error) {
      toast({
        title: "Error al exportar",
        description: "No se pudieron exportar los datos.",
        variant: "destructive"
      })
    }
    setIsExporting(false)
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        
        if (data.tasks) {
          setTasks(data.tasks)
        }
        if (data.settings) {
          setSettings(data.settings)
        }
        
        toast({
          title: "Datos importados",
          description: "Los datos han sido restaurados exitosamente."
        })
      } catch (error) {
        toast({
          title: "Error al importar",
          description: "El archivo no tiene un formato válido.",
          variant: "destructive"
        })
      }
    }
    reader.readAsText(file)
    event.target.value = '' // Reset input
  }

  const clearAllData = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.')) {
      setTasks([])
      setSettings({
        notifications: true,
        autoSave: true,
        compactView: false,
        showCompleted: true,
        defaultPriority: 'medium',
        weekStartsOn: 'monday'
      })
      
      toast({
        title: "Datos eliminados",
        description: "Todos los datos han sido eliminados.",
        variant: "destructive"
      })
    }
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <Sun className="h-4 w-4" />
      case 'dark': return <Moon className="h-4 w-4" />
      default: return <Monitor className="h-4 w-4" />
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case 'light': return 'Modo claro'
      case 'dark': return 'Modo oscuro'
      default: return 'Sistema'
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
          <p className="text-muted-foreground">Personaliza tu experiencia de estudio</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Apariencia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Apariencia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Tema</h4>
                <p className="text-sm text-muted-foreground">
                  Elige entre modo claro, oscuro o automático
                </p>
              </div>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-48">
                  <div className="flex items-center gap-2">
                    {getThemeIcon()}
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Modo claro
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Modo oscuro
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      Sistema
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Vista compacta</h4>
                <p className="text-sm text-muted-foreground">
                  Muestra más tareas en menos espacio
                </p>
              </div>
              <Switch
                checked={settings.compactView}
                onCheckedChange={(checked) => updateSetting('compactView', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Mostrar tareas completadas</h4>
                <p className="text-sm text-muted-foreground">
                  Incluir tareas completadas en las listas
                </p>
              </div>
              <Switch
                checked={settings.showCompleted}
                onCheckedChange={(checked) => updateSetting('showCompleted', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Comportamiento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Comportamiento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Notificaciones</h4>
                <p className="text-sm text-muted-foreground">
                  Recibir notificaciones de tareas y recordatorios
                </p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => updateSetting('notifications', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Guardado automático</h4>
                <p className="text-sm text-muted-foreground">
                  Guardar cambios automáticamente
                </p>
              </div>
              <Switch
                checked={settings.autoSave}
                onCheckedChange={(checked) => updateSetting('autoSave', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Prioridad por defecto</h4>
                <p className="text-sm text-muted-foreground">
                  Prioridad predeterminada para nuevas tareas
                </p>
              </div>
              <Select 
                value={settings.defaultPriority} 
                onValueChange={(value: 'low' | 'medium' | 'high') => updateSetting('defaultPriority', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Inicio de semana</h4>
                <p className="text-sm text-muted-foreground">
                  Primer día de la semana en el calendario
                </p>
              </div>
              <Select 
                value={settings.weekStartsOn} 
                onValueChange={(value: 'monday' | 'sunday') => updateSetting('weekStartsOn', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Lunes</SelectItem>
                  <SelectItem value="sunday">Domingo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Datos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Gestión de Datos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Tienes <strong>{tasks.length} tareas</strong> guardadas localmente. 
                Te recomendamos hacer respaldos regularmente.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={exportData} 
                disabled={isExporting}
                className="gap-2"
                variant="outline"
              >
                <Download className="h-4 w-4" />
                {isExporting ? 'Exportando...' : 'Exportar Datos'}
              </Button>

              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                  id="import-data"
                />
                <Button 
                  onClick={() => document.getElementById('import-data')?.click()}
                  className="gap-2 w-full"
                  variant="outline"
                >
                  <Upload className="h-4 w-4" />
                  Importar Datos
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-destructive">Zona de Peligro</h4>
                  <p className="text-sm text-muted-foreground">
                    Eliminar todos los datos de la aplicación
                  </p>
                </div>
              </div>
              <Button 
                onClick={clearAllData}
                variant="destructive"
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar Todos los Datos
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Información */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Información
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Versión:</span>
                <br />
                <Badge variant="outline">v1.0.0</Badge>
              </div>
              <div>
                <span className="font-medium">Almacenamiento:</span>
                <br />
                <span className="text-muted-foreground">Local (navegador)</span>
              </div>
            </div>
            
            <Separator />
            
            <p className="text-xs text-muted-foreground">
              StudyPlanner - Todos los datos se almacenan localmente en tu navegador. 
              No se envía información a servidores externos.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Settings