// Datos completos de la Biblia con los 66 libros

export interface BibleBookLocal {
  id: string
  nombre: string
  capitulos: number
  abreviatura: string
  resumen?: string
  categoria?: string
}

export const bibleBooks = {
  antiguoTestamento: [
    { 
      id: "genesis", 
      nombre: "Génesis", 
      capitulos: 50, 
      abreviatura: "GN",
      categoria: "Pentateuco (Ley)",
      resumen: "El libro de los orígenes: la creación, la caída, el diluvio y el inicio de la nación de Israel a través de los patriarcas."
    },
    { 
      id: "exodo", 
      nombre: "Éxodo", 
      capitulos: 40, 
      abreviatura: "EX",
      categoria: "Pentateuco (Ley)",
      resumen: "Narra la liberación de Israel de la esclavitud en Egipto y la entrega de la Ley en el Sinaí."
    },
    { 
      id: "levitico", 
      nombre: "Levítico", 
      capitulos: 27, 
      abreviatura: "LV",
      categoria: "Pentateuco (Ley)",
      resumen: "Manual de adoración y leyes para los sacerdotes y el pueblo, enfatizando la santidad de Dios."
    },
    { 
      id: "numeros", 
      nombre: "Números", 
      capitulos: 36, 
      abreviatura: "NM",
      categoria: "Pentateuco (Ley)",
      resumen: "Relata la peregrinación de Israel por el desierto hacia la Tierra Prometida y los censos del pueblo."
    },
    { 
      id: "deuteronomio", 
      nombre: "Deuteronomio", 
      capitulos: 34, 
      abreviatura: "DT",
      categoria: "Pentateuco (Ley)",
      resumen: "Moisés repasa la Ley y exhorta a la nueva generación a obedecer a Dios antes de entrar en Canaán."
    },
    { 
      id: "josue", 
      nombre: "Josué", 
      capitulos: 24, 
      abreviatura: "JOS",
      categoria: "Histórico",
      resumen: "La conquista y división de la Tierra Prometida bajo el liderazgo de Josué."
    },
    { 
      id: "jueces", 
      nombre: "Jueces", 
      capitulos: 21, 
      abreviatura: "JUE",
      categoria: "Histórico",
      resumen: "Ciclos de apostasía, opresión y liberación de Israel mediante líderes militares llamados jueces."
    },
    { 
      id: "rut", 
      nombre: "Rut", 
      capitulos: 4, 
      abreviatura: "RT",
      categoria: "Histórico",
      resumen: "Una historia de lealtad y redención que muestra el linaje del rey David y, finalmente, de Jesús."
    },
    { 
      id: "1-samuel", 
      nombre: "1 Samuel", 
      capitulos: 31, 
      abreviatura: "1S",
      categoria: "Histórico",
      resumen: "Transición de Israel de una teocracia a una monarquía, con Samuel, Saúl y el ascenso de David."
    },
    { 
      id: "2-samuel", 
      nombre: "2 Samuel", 
      capitulos: 24, 
      abreviatura: "2S",
      categoria: "Histórico",
      resumen: "El reinado de David como rey de Israel, sus triunfos, sus pecados y las consecuencias en su familia."
    },
    { 
      id: "1-reyes", 
      nombre: "1 Reyes", 
      capitulos: 22, 
      abreviatura: "1R",
      categoria: "Histórico",
      resumen: "El reinado de Salomón, la construcción del Templo y la división del reino en Norte (Israel) y Sur (Judá)."
    },
    { 
      id: "2-reyes", 
      nombre: "2 Reyes", 
      capitulos: 25, 
      abreviatura: "2R",
      categoria: "Histórico",
      resumen: "Historia de los reinos divididos hasta su caída y exilio: Israel por Asiria y Judá por Babilonia."
    },
    { 
      id: "1-cronicas", 
      nombre: "1 Crónicas", 
      capitulos: 29, 
      abreviatura: "1CR",
      categoria: "Histórico",
      resumen: "Genealogías y una perspectiva espiritual del reinado de David, enfocada en el Templo y la adoración."
    },
    { 
      id: "2-cronicas", 
      nombre: "2 Crónicas", 
      capitulos: 36, 
      abreviatura: "2CR",
      categoria: "Histórico",
      resumen: "Historia de los reyes de Judá, enfatizando las reformas religiosas y el Templo hasta el exilio."
    },
    { 
      id: "esdras", 
      nombre: "Esdras", 
      capitulos: 10, 
      abreviatura: "ESD",
      categoria: "Histórico",
      resumen: "El regreso de los exiliados judíos a Jerusalén y la reconstrucción del Templo y la comunidad."
    },
    { 
      id: "nehemias", 
      nombre: "Nehemías", 
      capitulos: 13, 
      abreviatura: "NEH",
      categoria: "Histórico",
      resumen: "La reconstrucción de los muros de Jerusalén y las reformas sociales y religiosas bajo Nehemías."
    },
    { 
      id: "ester", 
      nombre: "Ester", 
      capitulos: 10, 
      abreviatura: "EST",
      categoria: "Histórico",
      resumen: "Cómo la reina Ester salvó a los judíos de Persia del exterminio mediante la providencia divina."
    },
    { 
      id: "job", 
      nombre: "Job", 
      capitulos: 42, 
      abreviatura: "JOB",
      categoria: "Poético (Sapiencial)",
      resumen: "Explora el sufrimiento de los justos y la soberanía de Dios a través de la historia de Job."
    },
    { 
      id: "salmos", 
      nombre: "Salmos", 
      capitulos: 150, 
      abreviatura: "SAL",
      categoria: "Poético (Sapiencial)",
      resumen: "Colección de himnos, oraciones y poemas que expresan toda la gama de emociones humanas hacia Dios."
    },
    { 
      id: "proverbios", 
      nombre: "Proverbios", 
      capitulos: 31, 
      abreviatura: "PR",
      categoria: "Poético (Sapiencial)",
      resumen: "Dichos sabios para vivir una vida piadosa, justa y prudente, principalmente atribuidos a Salomón."
    },
    { 
      id: "eclesiastes", 
      nombre: "Eclesiastés", 
      capitulos: 12, 
      abreviatura: "EC",
      categoria: "Poético (Sapiencial)",
      resumen: "Reflexión sobre la vanidad de la vida sin Dios y la conclusión de que temer a Dios es lo único que importa."
    },
    { 
      id: "cantares", 
      nombre: "Cantares", 
      capitulos: 8, 
      abreviatura: "CNT",
      categoria: "Poético (Sapiencial)",
      resumen: "Poema que celebra el amor conyugal, a menudo interpretado también como el amor entre Dios y su pueblo."
    },
    { 
      id: "isaias", 
      nombre: "Isaías", 
      capitulos: 66, 
      abreviatura: "IS",
      categoria: "Profeta Mayor",
      resumen: "Profecías sobre el juicio, el consuelo y la venida del Mesías, el Siervo Sufridor."
    },
    { 
      id: "jeremias", 
      nombre: "Jeremías", 
      capitulos: 52, 
      abreviatura: "JER",
      categoria: "Profeta Mayor",
      resumen: "Advertencias sobre la caída de Jerusalén y promesas de un Nuevo Pacto, por el 'profeta llorón'."
    },
    { 
      id: "lamentaciones", 
      nombre: "Lamentaciones", 
      capitulos: 5, 
      abreviatura: "LM",
      categoria: "Profeta Mayor",
      resumen: "Cinco poemas fúnebres que lamentan la destrucción de Jerusalén pero afirman la fidelidad de Dios."
    },
    { 
      id: "ezequiel", 
      nombre: "Ezequiel", 
      capitulos: 48, 
      abreviatura: "EZ",
      categoria: "Profeta Mayor",
      resumen: "Visiones de la gloria de Dios, el juicio sobre Israel y las naciones, y la restauración futura del Templo."
    },
    { 
      id: "daniel", 
      nombre: "Daniel", 
      capitulos: 12, 
      abreviatura: "DN",
      categoria: "Profeta Mayor",
      resumen: "Historias de fidelidad en el exilio y visiones apocalípticas sobre los imperios mundiales y el Reino de Dios."
    },
    { 
      id: "oseas", 
      nombre: "Oseas", 
      capitulos: 14, 
      abreviatura: "OS",
      categoria: "Profeta Menor",
      resumen: "El matrimonio de Oseas con una mujer infiel ilustra el amor inquebrantable de Dios por su pueblo rebelde."
    },
    { 
      id: "joel", 
      nombre: "Joel", 
      capitulos: 3, 
      abreviatura: "JL",
      categoria: "Profeta Menor",
      resumen: "Profecía sobre el 'Día del Señor', el juicio mediante una plaga de langostas y el derramamiento del Espíritu."
    },
    { 
      id: "amos", 
      nombre: "Amós", 
      capitulos: 9, 
      abreviatura: "AM",
      categoria: "Profeta Menor",
      resumen: "Denuncia la injusticia social y la hipocresía religiosa en el reino del norte, Israel."
    },
    { 
      id: "abdias", 
      nombre: "Abdías", 
      capitulos: 1, 
      abreviatura: "ABD",
      categoria: "Profeta Menor",
      resumen: "Profecía de juicio contra Edom por su soberbia y maltrato a Judá."
    },
    { 
      id: "jonas", 
      nombre: "Jonás", 
      capitulos: 4, 
      abreviatura: "JON",
      categoria: "Profeta Menor",
      resumen: "La historia de un profeta renuente enviado a Nínive, mostrando la misericordia de Dios hacia los gentiles."
    },
    { 
      id: "miqueas", 
      nombre: "Miqueas", 
      capitulos: 7, 
      abreviatura: "MI",
      categoria: "Profeta Menor",
      resumen: "Predice el juicio sobre Israel y Judá, y promete el nacimiento del Mesías en Belén."
    },
    { 
      id: "nahum", 
      nombre: "Nahúm", 
      capitulos: 3, 
      abreviatura: "NAH",
      categoria: "Profeta Menor",
      resumen: "Profecía sobre la destrucción inminente de Nínive, la capital de Asiria."
    },
    { 
      id: "habacuc", 
      nombre: "Habacuc", 
      capitulos: 3, 
      abreviatura: "HAB",
      categoria: "Profeta Menor",
      resumen: "Diálogo entre el profeta y Dios sobre la justicia divina y la fe en medio de la adversidad."
    },
    { 
      id: "sofonias", 
      nombre: "Sofonías", 
      capitulos: 3, 
      abreviatura: "SOF",
      categoria: "Profeta Menor",
      resumen: "Anuncia el 'Día del Señor' como un día de juicio universal y purificación para un remanente fiel."
    },
    { 
      id: "hageo", 
      nombre: "Hageo", 
      capitulos: 2, 
      abreviatura: "HAG",
      categoria: "Profeta Menor",
      resumen: "Exhorta a los exiliados retornados a priorizar la reconstrucción del Templo de Dios."
    },
    { 
      id: "zacarias", 
      nombre: "Zacarías", 
      capitulos: 14, 
      abreviatura: "ZAC",
      categoria: "Profeta Menor",
      resumen: "Visiones mesiánicas y apocalípticas para alentar al pueblo en la reconstrucción del Templo."
    },
    { 
      id: "malaquias", 
      nombre: "Malaquías", 
      capitulos: 4, 
      abreviatura: "MAL",
      categoria: "Profeta Menor",
      resumen: "Llama al arrepentimiento por la corrupción sacerdotal y la negligencia en las ofrendas, prometiendo a Elías."
    },
  ] as BibleBookLocal[],
  nuevoTestamento: [
    { 
      id: "mateo", 
      nombre: "Mateo", 
      capitulos: 28, 
      abreviatura: "MT",
      categoria: "Evangelio",
      resumen: "Presenta a Jesús como el Mesías Rey prometido, cumpliendo las profecías del Antiguo Testamento."
    },
    { 
      id: "marcos", 
      nombre: "Marcos", 
      capitulos: 16, 
      abreviatura: "MR",
      categoria: "Evangelio",
      resumen: "Un relato dinámico de Jesús como el Siervo de Dios, enfocándose más en sus milagros y acciones."
    },
    { 
      id: "lucas", 
      nombre: "Lucas", 
      capitulos: 24, 
      abreviatura: "LC",
      categoria: "Evangelio",
      resumen: "Presenta a Jesús como el Hijo del Hombre, el Salvador perfecto para toda la humanidad, con énfasis en los marginados."
    },
    { 
      id: "juan", 
      nombre: "Juan", 
      capitulos: 21, 
      abreviatura: "JN",
      categoria: "Evangelio",
      resumen: "Enfatiza la divinidad de Jesús como el Hijo de Dios, el Verbo encarnado, para que creamos y tengamos vida."
    },
    { 
      id: "hechos", 
      nombre: "Hechos", 
      capitulos: 28, 
      abreviatura: "HCH",
      categoria: "Histórico",
      resumen: "La historia de la iglesia primitiva y la expansión del Evangelio por el poder del Espíritu Santo."
    },
    { 
      id: "romanos", 
      nombre: "Romanos", 
      capitulos: 16, 
      abreviatura: "RO",
      categoria: "Carta Paulina",
      resumen: "La explicación teológica más completa del Evangelio: justificación por fe, pecado y gracia."
    },
    { 
      id: "1-corintios", 
      nombre: "1 Corintios", 
      capitulos: 16, 
      abreviatura: "1CO",
      categoria: "Carta Paulina",
      resumen: "Aborda problemas de división, inmoralidad y desorden en la iglesia, y enseña sobre el amor y la resurrección."
    },
    { 
      id: "2-corintios", 
      nombre: "2 Corintios", 
      capitulos: 13, 
      abreviatura: "2CO",
      categoria: "Carta Paulina",
      resumen: "Defensa del ministerio apostólico de Pablo y enseñanza sobre el consuelo, la generosidad y la debilidad."
    },
    { 
      id: "galatas", 
      nombre: "Gálatas", 
      capitulos: 6, 
      abreviatura: "GA",
      categoria: "Carta Paulina",
      resumen: "Defensa de la libertad en Cristo frente al legalismo: la salvación es por fe, no por obras de la ley."
    },
    { 
      id: "efesios", 
      nombre: "Efesios", 
      capitulos: 6, 
      abreviatura: "EF",
      categoria: "Carta Paulina",
      resumen: "La unidad de la iglesia como cuerpo de Cristo y nuestra posición espiritual 'en los lugares celestiales'."
    },
    { 
      id: "filipenses", 
      nombre: "Filipenses", 
      capitulos: 4, 
      abreviatura: "FIL",
      categoria: "Carta Paulina",
      resumen: "La carta del gozo: anima a vivir con humildad, unidad y contentamiento en Cristo a pesar de las circunstancias."
    },
    { 
      id: "colosenses", 
      nombre: "Colosenses", 
      capitulos: 4, 
      abreviatura: "COL",
      categoria: "Carta Paulina",
      resumen: "Exalta la supremacía y suficiencia de Cristo sobre toda filosofía y poder espiritual."
    },
    { 
      id: "1-tesalonicenses", 
      nombre: "1 Tesalonicenses", 
      capitulos: 5, 
      abreviatura: "1TS",
      categoria: "Carta Paulina",
      resumen: "Elogia la fe de la iglesia y ofrece instrucción sobre la santidad y la segunda venida de Cristo."
    },
    { 
      id: "2-tesalonicenses", 
      nombre: "2 Tesalonicenses", 
      capitulos: 3, 
      abreviatura: "2TS",
      categoria: "Carta Paulina",
      resumen: "Corrige malentendidos sobre el regreso de Cristo y exhorta a la perseverancia y al trabajo."
    },
    { 
      id: "1-timoteo", 
      nombre: "1 Timoteo", 
      capitulos: 6, 
      abreviatura: "1TI",
      categoria: "Carta Pastoral",
      resumen: "Instrucciones a un joven pastor sobre el liderazgo de la iglesia, la doctrina y la piedad."
    },
    { 
      id: "2-timoteo", 
      nombre: "2 Timoteo", 
      capitulos: 4, 
      abreviatura: "2TI",
      categoria: "Carta Pastoral",
      resumen: "Última carta de Pablo, animando a Timoteo a permanecer fiel a la Palabra y predicar el Evangelio."
    },
    { 
      id: "tito", 
      nombre: "Tito", 
      capitulos: 3, 
      abreviatura: "TIT",
      categoria: "Carta Pastoral",
      resumen: "Instrucciones para organizar la iglesia en Creta y promover las buenas obras como fruto de la sana doctrina."
    },
    { 
      id: "filemon", 
      nombre: "Filemón", 
      capitulos: 1, 
      abreviatura: "FLM",
      categoria: "Carta Paulina",
      resumen: "Petición personal de Pablo a favor de Onésimo, un esclavo fugitivo convertido, apelando al amor cristiano."
    },
    { 
      id: "hebreos", 
      nombre: "Hebreos", 
      capitulos: 13, 
      abreviatura: "HE",
      categoria: "Carta General",
      resumen: "Demuestra la superioridad de Cristo sobre el sistema antiguo (ángeles, Moisés, sacerdotes) y exhorta a la fe."
    },
    { 
      id: "santiago", 
      nombre: "Santiago", 
      capitulos: 5, 
      abreviatura: "STG",
      categoria: "Carta General",
      resumen: "Enseñanza práctica sobre la fe genuina que se demuestra mediante las obras y el control de la lengua."
    },
    { 
      id: "1-pedro", 
      nombre: "1 Pedro", 
      capitulos: 5, 
      abreviatura: "1P",
      categoria: "Carta General",
      resumen: "Anima a los cristianos a mantenerse firmes y santos en medio del sufrimiento y la persecución."
    },
    { 
      id: "2-pedro", 
      nombre: "2 Pedro", 
      capitulos: 3, 
      abreviatura: "2P",
      categoria: "Carta General",
      resumen: "Advierte contra los falsos maestros y reafirma la certeza de la segunda venida de Cristo."
    },
    { 
      id: "1-juan", 
      nombre: "1 Juan", 
      capitulos: 5, 
      abreviatura: "1JN",
      categoria: "Carta General",
      resumen: "Pruebas de la verdadera comunión con Dios: amor, obediencia y fe en Jesús como el Hijo de Dios."
    },
    { 
      id: "2-juan", 
      nombre: "2 Juan", 
      capitulos: 1, 
      abreviatura: "2JN",
      categoria: "Carta General",
      resumen: "Advertencia contra recibir a falsos maestros que no enseñan la verdad sobre Cristo."
    },
    { 
      id: "3-juan", 
      nombre: "3 Juan", 
      capitulos: 1, 
      abreviatura: "3JN",
      categoria: "Carta General",
      resumen: "Elogio a Gayo por su hospitalidad y crítica a Diótrefes por su ambición y falta de amor."
    },
    { 
      id: "judas", 
      nombre: "Judas", 
      capitulos: 1, 
      abreviatura: "JUD",
      categoria: "Carta General",
      resumen: "Exhortación a contender ardientemente por la fe contra los apóstatas que se han infiltrado."
    },
    { 
      id: "apocalipsis", 
      nombre: "Apocalipsis", 
      capitulos: 22, 
      abreviatura: "AP",
      categoria: "Profecía",
      resumen: "Revelación de Jesucristo sobre el fin de los tiempos, el triunfo final de Dios sobre el mal y la Nueva Jerusalén."
    },
  ] as BibleBookLocal[],
}

// Función para obtener todos los libros en una lista plana
export function getAllBooksFlat(): BibleBookLocal[] {
  return [...bibleBooks.antiguoTestamento, ...bibleBooks.nuevoTestamento]
}

// Función para encontrar un libro por su ID
export function findBookById(id: string): BibleBookLocal | undefined {
  return getAllBooksFlat().find((book) => book.id === id)
}

// Función para encontrar un libro por nombre
export function findBookByName(name: string): BibleBookLocal | undefined {
  const normalizedName = name.toLowerCase()
  return getAllBooksFlat().find(
    (book) =>
      book.nombre.toLowerCase() === normalizedName ||
      book.id === normalizedName ||
      book.abreviatura.toLowerCase() === normalizedName,
  )
}

// Función para obtener libros anterior y siguiente
export function getAdjacentBooks(currentId: string): { prev: BibleBookLocal | null; next: BibleBookLocal | null } {
  const allBooks = getAllBooksFlat()
  const currentIndex = allBooks.findIndex((book) => book.id === currentId)

  return {
    prev: currentIndex > 0 ? allBooks[currentIndex - 1] : null,
    next: currentIndex < allBooks.length - 1 ? allBooks[currentIndex + 1] : null,
  }
}

// Versículos destacados para el versículo del día
export const featuredVerses = [
  { libro: "Juan", capitulo: 3, versiculo: 16, id: "juan" },
  { libro: "Salmos", capitulo: 23, versiculo: 1, id: "salmos" },
  { libro: "Filipenses", capitulo: 4, versiculo: 13, id: "filipenses" },
  { libro: "Proverbios", capitulo: 3, versiculo: 5, id: "proverbios" },
  { libro: "Isaías", capitulo: 41, versiculo: 10, id: "isaias" },
  { libro: "Romanos", capitulo: 8, versiculo: 28, id: "romanos" },
  { libro: "Jeremías", capitulo: 29, versiculo: 11, id: "jeremias" },
  { libro: "Mateo", capitulo: 11, versiculo: 28, id: "mateo" },
  { libro: "Salmos", capitulo: 46, versiculo: 1, id: "salmos" },
  { libro: "Gálatas", capitulo: 5, versiculo: 22, id: "galatas" },
]

export const themes = [
  { 
    id: "amor", 
    nombre: "Amor", 
    color: "#ec4899", 
    versiculos: 45,
    relatedVerses: [
      { libro: "Juan", capitulo: 3, versiculo: 16, texto: "Porque de tal manera amó Dios al mundo..." },
      { libro: "1 Corintios", capitulo: 13, versiculo: 4, texto: "El amor es sufrido, es benigno; el amor no tiene envidia..." },
      { libro: "Romanos", capitulo: 5, versiculo: 8, texto: "Mas Dios muestra su amor para con nosotros, en que siendo aún pecadores, Cristo murió por nosotros." }
    ]
  },
  { 
    id: "fe", 
    nombre: "Fe", 
    color: "#8b5cf6", 
    versiculos: 38,
    relatedVerses: [
      { libro: "Hebreos", capitulo: 11, versiculo: 1, texto: "Es, pues, la fe la certeza de lo que se espera, la convicción de lo que no se ve." },
      { libro: "Romanos", capitulo: 10, versiculo: 17, texto: "Así que la fe es por el oír, y el oír, por la palabra de Dios." }
    ]
  },
  { 
    id: "esperanza", 
    nombre: "Esperanza", 
    color: "#06b6d4", 
    versiculos: 32,
    relatedVerses: [
      { libro: "Jeremías", capitulo: 29, versiculo: 11, texto: "Porque yo sé los pensamientos que tengo acerca de vosotros..." },
      { libro: "Romanos", capitulo: 15, versiculo: 13, texto: "Y el Dios de esperanza os llene de todo gozo y paz en el creer..." }
    ]
  },
  { 
    id: "perdon", 
    nombre: "Perdón", 
    color: "#22c55e", 
    versiculos: 28,
    relatedVerses: [
      { libro: "1 Juan", capitulo: 1, versiculo: 9, texto: "Si confesamos nuestros pecados, él es fiel y justo para perdonar..." },
      { libro: "Efesios", capitulo: 4, versiculo: 32, texto: "Antes sed benignos unos con otros, misericordiosos, perdonándoos unos a otros..." }
    ]
  },
  { 
    id: "sabiduria", 
    nombre: "Sabiduría", 
    color: "#f59e0b", 
    versiculos: 52,
    relatedVerses: [
      { libro: "Santiago", capitulo: 1, versiculo: 5, texto: "Y si alguno de vosotros tiene falta de sabiduría, pídala a Dios..." },
      { libro: "Proverbios", capitulo: 1, versiculo: 7, texto: "El principio de la sabiduría es el temor de Jehová..." }
    ]
  },
  { 
    id: "oracion", 
    nombre: "Oración", 
    color: "#6366f1", 
    versiculos: 41,
    relatedVerses: [
      { libro: "1 Tesalonicenses", capitulo: 5, versiculo: 17, texto: "Orad sin cesar." },
      { libro: "Filipenses", capitulo: 4, versiculo: 6, texto: "Por nada estéis afanosos, sino sean conocidas vuestras peticiones..." }
    ]
  },
  { 
    id: "paz", 
    nombre: "Paz", 
    color: "#14b8a6", 
    versiculos: 35,
    relatedVerses: [
      { libro: "Juan", capitulo: 14, versiculo: 27, texto: "La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da." },
      { libro: "Filipenses", capitulo: 4, versiculo: 7, texto: "Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones..." }
    ]
  },
  { 
    id: "gracia", 
    nombre: "Gracia", 
    color: "#f472b6", 
    versiculos: 29,
    relatedVerses: [
      { libro: "Efesios", capitulo: 2, versiculo: 8, texto: "Porque por gracia sois salvos por medio de la fe..." },
      { libro: "2 Corintios", capitulo: 12, versiculo: 9, texto: "Y me ha dicho: Bástate mi gracia; porque mi poder se perfecciona en la debilidad." }
    ]
  },
  { 
    id: "fortaleza", 
    nombre: "Fortaleza", 
    color: "#e11d48", 
    versiculos: 25,
    relatedVerses: [
      { libro: "Isaías", capitulo: 40, versiculo: 31, texto: "Pero los que esperan a Jehová tendrán nuevas fuerzas..." },
      { libro: "Filipenses", capitulo: 4, versiculo: 13, texto: "Todo lo puedo en Cristo que me fortalece." }
    ]
  },
]

// Versículos completos para el componente VerseOfDay
export const dailyVerses = [
  {
    libro: "Juan",
    capitulo: 3,
    versiculo: 16,
    texto:
      "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.",
    version: "Reina-Valera 1960",
  },
  {
    libro: "Salmos",
    capitulo: 23,
    versiculo: 1,
    texto: "Jehová es mi pastor; nada me faltará.",
    version: "Reina-Valera 1960",
  },
  {
    libro: "Filipenses",
    capitulo: 4,
    versiculo: 13,
    texto: "Todo lo puedo en Cristo que me fortalece.",
    version: "Reina-Valera 1960",
  },
  {
    libro: "Proverbios",
    capitulo: 3,
    versiculo: 5,
    texto: "Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia.",
    version: "Reina-Valera 1960",
  },
  {
    libro: "Isaías",
    capitulo: 41,
    versiculo: 10,
    texto:
      "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.",
    version: "Reina-Valera 1960",
  },
  {
    libro: "Romanos",
    capitulo: 8,
    versiculo: 28,
    texto:
      "Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.",
    version: "Reina-Valera 1960",
  },
  {
    libro: "Jeremías",
    capitulo: 29,
    versiculo: 11,
    texto:
      "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.",
    version: "Reina-Valera 1960",
  },
  {
    libro: "Mateo",
    capitulo: 11,
    versiculo: 28,
    texto: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.",
    version: "Reina-Valera 1960",
  },
  {
    libro: "Salmos",
    capitulo: 46,
    versiculo: 1,
    texto: "Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.",
    version: "Reina-Valera 1960",
  },
  {
    libro: "Gálatas",
    capitulo: 5,
    versiculo: 22,
    texto: "Mas el fruto del Espíritu es amor, gozo, paz, paciencia, benignidad, bondad, fe, mansedumbre, templanza.",
    version: "Reina-Valera 1960",
  },
]

export const characters = [
  { 
    id: "jesus", 
    nombre: "Jesús", 
    tipo: "divino", 
    menciones: 1281,
    relatedVerses: [
      { libro: "Juan", capitulo: 14, versiculo: 6, texto: "Jesús le dijo: Yo soy el camino, y la verdad, y la vida..." },
      { libro: "Mateo", capitulo: 1, versiculo: 21, texto: "Y dará a luz un hijo, y llamarás su nombre JESÚS..." }
    ]
  },
  { 
    id: "moises", 
    nombre: "Moisés", 
    tipo: "profeta", 
    menciones: 848,
    relatedVerses: [
      { libro: "Éxodo", capitulo: 3, versiculo: 14, texto: "Y respondió Dios a Moisés: YO SOY EL QUE SOY." },
      { libro: "Deuteronomio", capitulo: 34, versiculo: 10, texto: "Y nunca más se levantó profeta en Israel como Moisés..." }
    ]
  },
  { 
    id: "david", 
    nombre: "David", 
    tipo: "rey", 
    menciones: 1118,
    relatedVerses: [
      { libro: "1 Samuel", capitulo: 16, versiculo: 13, texto: "Y Samuel tomó el cuerno del aceite, y lo ungió en medio de sus hermanos..." },
      { libro: "Salmos", capitulo: 23, versiculo: 1, texto: "Jehová es mi pastor; nada me faltará. (Salmo de David)" }
    ]
  },
  { 
    id: "abraham", 
    nombre: "Abraham", 
    tipo: "patriarca", 
    menciones: 312,
    relatedVerses: [
      { libro: "Génesis", capitulo: 12, versiculo: 1, texto: "Pero Jehová había dicho a Abram: Vete de tu tierra y de tu parentela..." },
      { libro: "Génesis", capitulo: 15, versiculo: 6, texto: "Y creyó a Jehová, y le fue contado por justicia." }
    ]
  },
  { 
    id: "pablo", 
    nombre: "Pablo", 
    tipo: "apóstol", 
    menciones: 185,
    relatedVerses: [
      { libro: "Hechos", capitulo: 9, versiculo: 4, texto: "y cayendo en tierra, oyó una voz que le decía: Saulo, Saulo, ¿por qué me persigues?" },
      { libro: "Filipenses", capitulo: 1, versiculo: 21, texto: "Porque para mí el vivir es Cristo, y el morir es ganancia." }
    ]
  },
  { 
    id: "pedro", 
    nombre: "Pedro", 
    tipo: "apóstol", 
    menciones: 166,
    relatedVerses: [
      { libro: "Mateo", capitulo: 16, versiculo: 18, texto: "Y yo también te digo, que tú eres Pedro, y sobre esta roca edificaré mi iglesia..." },
      { libro: "1 Pedro", capitulo: 1, versiculo: 3, texto: "Bendito el Dios y Padre de nuestro Señor Jesucristo..." }
    ]
  },
  { 
    id: "maria", 
    nombre: "María", 
    tipo: "madre", 
    menciones: 54,
    relatedVerses: [
      { libro: "Lucas", capitulo: 1, versiculo: 38, texto: "Entonces María dijo: He aquí la sierva del Señor; hágase conmigo conforme a tu palabra." },
      { libro: "Lucas", capitulo: 1, versiculo: 46, texto: "Entonces María dijo: Engrandece mi alma al Señor..." }
    ]
  },
  { 
    id: "salomon", 
    nombre: "Salomón", 
    tipo: "rey", 
    menciones: 295,
    relatedVerses: [
      { libro: "1 Reyes", capitulo: 3, versiculo: 9, texto: "Da, pues, a tu siervo corazón entendido para juzgar a tu pueblo..." },
      { libro: "Proverbios", capitulo: 1, versiculo: 1, texto: "Los proverbios de Salomón, hijo de David, rey de Israel." }
    ]
  },
]
