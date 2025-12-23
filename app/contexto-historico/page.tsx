"use client"

import { AppShell } from "@/components/layout/app-shell"
import { TweetCard } from "@/components/history/tweet-card"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Scroll, Info, BookOpen, MapPin, AlertTriangle, Sparkles, Globe } from "lucide-react"

export default function HistoricalContextPage() {
  const points = [
    {
      id: 1,
      title: "Provincia de Roma",
      content: "Judea era provincia de Roma en el tiempo de Jesús: así que no pertenecía a los judíos, sino a los Romanos.",
      icon: MapPin
    },
    {
      id: 2,
      title: "Heródoto y Palestina",
      content: "Cinco siglos antes, el historiador griego Heródoto, en su obra fundamental 'Las Historias', que aún se estudia en la mayoría de las universidades hoy, llama a Judea 'Palestina'.",
      icon: BookOpen
    },
    {
      id: 3,
      title: "Referencias Egipcias",
      content: "Doce siglos antes, los egipcios se referían a ella como 'Peleset', nombre que todavía se encuentra en las inscripciones que se conservan del reinado de Ramsés III (c. 1186-1155 a. C.) en Medinet Habu.",
      icon: Scroll
    },
    {
      id: 4,
      title: "Siria Palestina",
      content: "Por lo tanto, cuando los romanos cambiaron oficialmente el nombre de la provincia de Judea a Siria Palestina en el año 135 d. C., 1) tenían la autoridad legal para hacerlo y 2) no estaban haciendo nada innovador, ya que ese era el nombre original de la región.",
      icon: Info
    },
    {
      id: 5,
      title: "Identidad Judía de Jesús",
      content: "Jesús no es un judío en el sentido moderno: Él no es asquenazí, ni sefardí, ni mizrají, y ciertamente no es talmúdico. Es judío en el sentido del Antiguo Testamento: de la tribu de Judá, de la familia de David. La mayoría de los judíos de hoy son descendientes de conversos gentiles al judaísmo talmúdico, o una mezcla híbrida a tal grado que tienen poca consanguinidad con los antiguos israelitas. De hecho, el pueblo palestino, al que el estado moderno de Israel está masacrando e intentando borrar de la tierra, tiene un mayor vínculo genético con los antiguos israelitas que la mayoría de los judíos de la diáspora. Así que, los 'judíos' de hoy, son realmente los antisemitas.",
      icon: AlertTriangle
    },
    {
      id: 6,
      title: "El Nuevo Pacto",
      content: `Jesús condenó a los fariseos, los padres del judaísmo. Jesús condenó al Sanedrín, la autoridad religiosa del pueblo judío. Jesús profetizó la destrucción del templo, el centro de la religión judía. ¿Por qué? Porque Jesús no es simplemente "un judío", sino el Mesías, el Hijo de Dios encarnado, y vino para hacer todas las cosas nuevas. Ya no importa ser judío según la carne; lo que importa es la fe en Él (Gálatas 3:28-29). Ya Dios no busca adoración en un templo físico en Jerusalén; sino la adoración por el Espíritu (Juan 4:23). Y todos los "judíos" de hoy que rechazan a Jesús como el Mesías e Hijo de Dios, no forman parte del pueblo elegido de Dios, sino que son la sinagoga de Satanás (Apocalipsis 2:9).`,
      icon: Sparkles
    },
    {
      id: 7,
      title: "Reino Universal",
      content: `Así que, vuestra maniobra política es nula. Son ustedes los que están tratando de politizar a Jesucristo, pintándolo como si fuera un sionista pro-Israel dispuesto a matar a palestinos para reconquistar Judea de Palestina: nada más lejos de la realidad. El reino de Jesucristo es universal, no racial, y se gana no con tanques y bombas de guerra, sino con la proclamación del Evangelio. Ustedes ni creen en Él, y por eso, en lugar de gloriarse en Él como el Hijo de Dios encarnado, se glorían en que "era judío". Vuestra jactancia es la misma que la de los fariseos.`,
      quote: `– "¡Raza de víboras! ¿Quién os enseñó a huir de la ira que vendrá? Por tanto, dad frutos dignos de arrepentimiento; y no comencéis a deciros a vosotros mismos: «Tenemos a Abraham por padre», porque os digo que Dios puede levantar hijos a Abraham de estas piedras" (S. Lucas 3:7-8).`,
      icon: Globe
    }
  ]

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 pb-20">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
            Entendiendo la Situación Histórica
          </h1>
          <p className="text-xl text-muted-foreground font-light">
            Judea, Palestina y el Contexto Histórico de Jesús
          </p>
        </div>

        {/* Tweet Section */}
        <Card className="glass-card p-6 border-primary/20 bg-background/50 backdrop-blur-xl">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="bg-primary/10 p-2 rounded-full text-primary">🐦</span>
                Fuente Original
            </h2>
            <TweetCard id="2003098147120164992" />
        </Card>

        {/* Main Content Timeline */}
        <div className="space-y-6">
            {points.map((point, index) => (
                <motion.div
                    key={point.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Card className="p-6 md:p-8 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md bg-card/80 backdrop-blur-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
                                {point.id}
                            </div>
                            <div className="space-y-3 flex-1">
                                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    {point.title}
                                    {point.icon && <point.icon className="w-5 h-5 text-muted-foreground/50" />}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-base">
                                    {point.content}
                                </p>
                                {point.quote && (
                                    <blockquote className="mt-4 p-4 border-l-4 border-primary/30 bg-muted/30 italic text-muted-foreground rounded-r-lg">
                                        {point.quote}
                                    </blockquote>
                                )}
                            </div>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>

        {/* Final Section */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center space-y-6"
        >
            <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
                <h3 className="text-2xl font-serif font-bold mb-4 text-primary">Por último</h3>
                <p className="text-lg font-medium mb-2">No se dice "felices fiestas".</p>
                <p className="text-lg mb-6">
                    Se dice <span className="font-bold text-primary">feliz y santa Navidad</span>: Jesús el Mesías, el Hijo de Dios eterno, os ha nacido hoy en Belen de Judea, tierra palestina.
                </p>
                
                <div className="max-w-2xl mx-auto">
                    <blockquote className="text-muted-foreground italic leading-relaxed font-serif text-lg">
                        "Pero no habrá más lobreguez para la que estaba en angustia. Como en tiempos pasados Él trató con desprecio a la tierra de Zabulón y a la tierra de Neftalí, pero después la hará gloriosa por el camino del mar al otro lado del Jordán, Galilea de los gentiles. Porque un niño nos ha nacido, un hijo nos ha sido dado, y la soberanía reposará sobre sus hombros; y se llamará su nombre Admirable Consejero, Dios Poderoso, Padre Eterno, Príncipe de Paz".
                    </blockquote>
                    <cite className="block mt-4 text-sm font-semibold text-primary">– Isaías 9:1, 6</cite>
                </div>
            </div>
        </motion.div>

      </div>
    </AppShell>
  )
}

function SparklesIcon(props: any) {
    return (
        <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
    )
}

function GlobeIcon(props: any) {
    return (
        <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
        </svg>
    )
}
