"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Flame, Star, Crown, TrendingUp, Users } from "lucide-react"
import { motion } from "framer-motion"

const leaderboard = [
  { rank: 1, nombre: "María García", xp: 5420, racha: 45, nivel: "Sabio Bíblico", avatar: "MG" },
  { rank: 2, nombre: "Carlos Rodríguez", xp: 4890, racha: 38, nivel: "Apóstol Digital", avatar: "CR" },
  { rank: 3, nombre: "Ana Martínez", xp: 4650, racha: 42, nivel: "Apóstol Digital", avatar: "AM" },
  { rank: 4, nombre: "Pedro López", xp: 4200, racha: 30, nivel: "Profeta en Formación", avatar: "PL" },
  { rank: 5, nombre: "Laura Sánchez", xp: 3980, racha: 28, nivel: "Profeta en Formación", avatar: "LS" },
  { rank: 6, nombre: "Tú", xp: 450, racha: 12, nivel: "Buscador de Sabiduría", avatar: "TÚ", isUser: true },
]

const estadisticasGlobales = [
  { label: "Usuarios activos", valor: "12,847", icono: Users },
  { label: "Versículos leídos hoy", valor: "45,239", icono: Star },
  { label: "Mayor racha actual", valor: "156 días", icono: Flame },
  { label: "Quizzes completados", valor: "8,421", icono: Trophy },
]

export function LeaderboardPage() {
  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Tabla de Líderes</h1>
        <p className="text-muted-foreground">Compite con la comunidad y alcanza la cima</p>
      </div>

      {/* Estadísticas globales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {estadisticasGlobales.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <stat.icono className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{stat.valor}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="global" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="semanal">Esta Semana</TabsTrigger>
          <TabsTrigger value="amigos">Amigos</TabsTrigger>
        </TabsList>

        <TabsContent value="global">
          {/* Top 3 */}
          <div className="flex justify-center items-end gap-4 mb-8">
            {/* Segundo lugar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="relative">
                <Avatar className="w-16 h-16 mx-auto border-4 border-gray-400">
                  <AvatarFallback className="bg-secondary text-lg">{leaderboard[1].avatar}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
                  <span className="text-xs font-bold text-background">2</span>
                </div>
              </div>
              <p className="font-semibold text-foreground mt-4 text-sm">{leaderboard[1].nombre}</p>
              <p className="text-xs text-muted-foreground">{leaderboard[1].xp} XP</p>
            </motion.div>

            {/* Primer lugar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="relative">
                <Crown className="w-8 h-8 text-accent mx-auto mb-2" />
                <Avatar className="w-20 h-20 mx-auto border-4 border-accent">
                  <AvatarFallback className="bg-accent/20 text-xl">{leaderboard[0].avatar}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-sm font-bold text-accent-foreground">1</span>
                </div>
              </div>
              <p className="font-semibold text-foreground mt-4">{leaderboard[0].nombre}</p>
              <p className="text-sm text-muted-foreground">{leaderboard[0].xp} XP</p>
            </motion.div>

            {/* Tercer lugar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="relative">
                <Avatar className="w-16 h-16 mx-auto border-4 border-amber-700">
                  <AvatarFallback className="bg-secondary text-lg">{leaderboard[2].avatar}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-amber-700 flex items-center justify-center">
                  <span className="text-xs font-bold text-background">3</span>
                </div>
              </div>
              <p className="font-semibold text-foreground mt-4 text-sm">{leaderboard[2].nombre}</p>
              <p className="text-xs text-muted-foreground">{leaderboard[2].xp} XP</p>
            </motion.div>
          </div>

          {/* Lista completa */}
          <Card className="glass-card divide-y divide-border">
            {leaderboard.slice(3).map((user, index) => (
              <motion.div
                key={user.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`flex items-center justify-between p-4 ${user.isUser && "bg-primary/10"}`}
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 text-center font-bold text-muted-foreground">{user.rank}</span>
                  <Avatar className="w-10 h-10">
                    <AvatarFallback
                      className={user.isUser ? "gradient-primary text-primary-foreground" : "bg-secondary"}
                    >
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{user.nombre}</p>
                    <p className="text-xs text-muted-foreground">{user.nivel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="font-semibold text-foreground">{user.xp} XP</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                      <Flame className="w-3 h-3 text-orange-500" />
                      {user.racha} días
                    </p>
                  </div>
                  {user.isUser && (
                    <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                      <TrendingUp className="w-4 h-4" />
                      Subir
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </Card>
        </TabsContent>

        <TabsContent value="semanal">
          <Card className="glass-card p-8 text-center">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Ranking Semanal</h3>
            <p className="text-muted-foreground mb-4">El ranking semanal se actualiza cada lunes</p>
            <p className="text-sm text-muted-foreground">Próxima actualización: Lunes 9:00 AM</p>
          </Card>
        </TabsContent>

        <TabsContent value="amigos">
          <Card className="glass-card p-8 text-center">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Invita a tus amigos</h3>
            <p className="text-muted-foreground mb-4">Compite con amigos y familiares en su propio ranking</p>
            <Button className="gradient-primary border-0">Invitar Amigos</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
