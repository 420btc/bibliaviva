// Datos completos de la Biblia con los 66 libros

export interface BibleBookLocal {
  id: string
  nombre: string
  capitulos: number
  abreviatura: string
}

export const bibleBooks = {
  antiguoTestamento: [
    { id: "genesis", nombre: "Génesis", capitulos: 50, abreviatura: "GN" },
    { id: "exodo", nombre: "Éxodo", capitulos: 40, abreviatura: "EX" },
    { id: "levitico", nombre: "Levítico", capitulos: 27, abreviatura: "LV" },
    { id: "numeros", nombre: "Números", capitulos: 36, abreviatura: "NM" },
    { id: "deuteronomio", nombre: "Deuteronomio", capitulos: 34, abreviatura: "DT" },
    { id: "josue", nombre: "Josué", capitulos: 24, abreviatura: "JOS" },
    { id: "jueces", nombre: "Jueces", capitulos: 21, abreviatura: "JUE" },
    { id: "rut", nombre: "Rut", capitulos: 4, abreviatura: "RT" },
    { id: "1-samuel", nombre: "1 Samuel", capitulos: 31, abreviatura: "1S" },
    { id: "2-samuel", nombre: "2 Samuel", capitulos: 24, abreviatura: "2S" },
    { id: "1-reyes", nombre: "1 Reyes", capitulos: 22, abreviatura: "1R" },
    { id: "2-reyes", nombre: "2 Reyes", capitulos: 25, abreviatura: "2R" },
    { id: "1-cronicas", nombre: "1 Crónicas", capitulos: 29, abreviatura: "1CR" },
    { id: "2-cronicas", nombre: "2 Crónicas", capitulos: 36, abreviatura: "2CR" },
    { id: "esdras", nombre: "Esdras", capitulos: 10, abreviatura: "ESD" },
    { id: "nehemias", nombre: "Nehemías", capitulos: 13, abreviatura: "NEH" },
    { id: "ester", nombre: "Ester", capitulos: 10, abreviatura: "EST" },
    { id: "job", nombre: "Job", capitulos: 42, abreviatura: "JOB" },
    { id: "salmos", nombre: "Salmos", capitulos: 150, abreviatura: "SAL" },
    { id: "proverbios", nombre: "Proverbios", capitulos: 31, abreviatura: "PR" },
    { id: "eclesiastes", nombre: "Eclesiastés", capitulos: 12, abreviatura: "EC" },
    { id: "cantares", nombre: "Cantares", capitulos: 8, abreviatura: "CNT" },
    { id: "isaias", nombre: "Isaías", capitulos: 66, abreviatura: "IS" },
    { id: "jeremias", nombre: "Jeremías", capitulos: 52, abreviatura: "JER" },
    { id: "lamentaciones", nombre: "Lamentaciones", capitulos: 5, abreviatura: "LM" },
    { id: "ezequiel", nombre: "Ezequiel", capitulos: 48, abreviatura: "EZ" },
    { id: "daniel", nombre: "Daniel", capitulos: 12, abreviatura: "DN" },
    { id: "oseas", nombre: "Oseas", capitulos: 14, abreviatura: "OS" },
    { id: "joel", nombre: "Joel", capitulos: 3, abreviatura: "JL" },
    { id: "amos", nombre: "Amós", capitulos: 9, abreviatura: "AM" },
    { id: "abdias", nombre: "Abdías", capitulos: 1, abreviatura: "ABD" },
    { id: "jonas", nombre: "Jonás", capitulos: 4, abreviatura: "JON" },
    { id: "miqueas", nombre: "Miqueas", capitulos: 7, abreviatura: "MI" },
    { id: "nahum", nombre: "Nahúm", capitulos: 3, abreviatura: "NAH" },
    { id: "habacuc", nombre: "Habacuc", capitulos: 3, abreviatura: "HAB" },
    { id: "sofonias", nombre: "Sofonías", capitulos: 3, abreviatura: "SOF" },
    { id: "hageo", nombre: "Hageo", capitulos: 2, abreviatura: "HAG" },
    { id: "zacarias", nombre: "Zacarías", capitulos: 14, abreviatura: "ZAC" },
    { id: "malaquias", nombre: "Malaquías", capitulos: 4, abreviatura: "MAL" },
  ] as BibleBookLocal[],
  nuevoTestamento: [
    { id: "mateo", nombre: "Mateo", capitulos: 28, abreviatura: "MT" },
    { id: "marcos", nombre: "Marcos", capitulos: 16, abreviatura: "MR" },
    { id: "lucas", nombre: "Lucas", capitulos: 24, abreviatura: "LC" },
    { id: "juan", nombre: "Juan", capitulos: 21, abreviatura: "JN" },
    { id: "hechos", nombre: "Hechos", capitulos: 28, abreviatura: "HCH" },
    { id: "romanos", nombre: "Romanos", capitulos: 16, abreviatura: "RO" },
    { id: "1-corintios", nombre: "1 Corintios", capitulos: 16, abreviatura: "1CO" },
    { id: "2-corintios", nombre: "2 Corintios", capitulos: 13, abreviatura: "2CO" },
    { id: "galatas", nombre: "Gálatas", capitulos: 6, abreviatura: "GA" },
    { id: "efesios", nombre: "Efesios", capitulos: 6, abreviatura: "EF" },
    { id: "filipenses", nombre: "Filipenses", capitulos: 4, abreviatura: "FIL" },
    { id: "colosenses", nombre: "Colosenses", capitulos: 4, abreviatura: "COL" },
    { id: "1-tesalonicenses", nombre: "1 Tesalonicenses", capitulos: 5, abreviatura: "1TS" },
    { id: "2-tesalonicenses", nombre: "2 Tesalonicenses", capitulos: 3, abreviatura: "2TS" },
    { id: "1-timoteo", nombre: "1 Timoteo", capitulos: 6, abreviatura: "1TI" },
    { id: "2-timoteo", nombre: "2 Timoteo", capitulos: 4, abreviatura: "2TI" },
    { id: "tito", nombre: "Tito", capitulos: 3, abreviatura: "TIT" },
    { id: "filemon", nombre: "Filemón", capitulos: 1, abreviatura: "FLM" },
    { id: "hebreos", nombre: "Hebreos", capitulos: 13, abreviatura: "HE" },
    { id: "santiago", nombre: "Santiago", capitulos: 5, abreviatura: "STG" },
    { id: "1-pedro", nombre: "1 Pedro", capitulos: 5, abreviatura: "1P" },
    { id: "2-pedro", nombre: "2 Pedro", capitulos: 3, abreviatura: "2P" },
    { id: "1-juan", nombre: "1 Juan", capitulos: 5, abreviatura: "1JN" },
    { id: "2-juan", nombre: "2 Juan", capitulos: 1, abreviatura: "2JN" },
    { id: "3-juan", nombre: "3 Juan", capitulos: 1, abreviatura: "3JN" },
    { id: "judas", nombre: "Judas", capitulos: 1, abreviatura: "JUD" },
    { id: "apocalipsis", nombre: "Apocalipsis", capitulos: 22, abreviatura: "AP" },
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
  { id: "amor", nombre: "Amor", color: "#ec4899", versiculos: 45 },
  { id: "fe", nombre: "Fe", color: "#8b5cf6", versiculos: 38 },
  { id: "esperanza", nombre: "Esperanza", color: "#06b6d4", versiculos: 32 },
  { id: "perdon", nombre: "Perdón", color: "#22c55e", versiculos: 28 },
  { id: "sabiduria", nombre: "Sabiduría", color: "#f59e0b", versiculos: 52 },
  { id: "oracion", nombre: "Oración", color: "#6366f1", versiculos: 41 },
  { id: "paz", nombre: "Paz", color: "#14b8a6", versiculos: 35 },
  { id: "gracia", nombre: "Gracia", color: "#f472b6", versiculos: 29 },
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
  { id: "jesus", nombre: "Jesús", tipo: "divino", menciones: 1281 },
  { id: "moises", nombre: "Moisés", tipo: "profeta", menciones: 848 },
  { id: "david", nombre: "David", tipo: "rey", menciones: 1118 },
  { id: "abraham", nombre: "Abraham", tipo: "patriarca", menciones: 312 },
  { id: "pablo", nombre: "Pablo", tipo: "apóstol", menciones: 185 },
  { id: "pedro", nombre: "Pedro", tipo: "apóstol", menciones: 166 },
  { id: "maria", nombre: "María", tipo: "madre", menciones: 54 },
  { id: "salomon", nombre: "Salomón", tipo: "rey", menciones: 295 },
]
