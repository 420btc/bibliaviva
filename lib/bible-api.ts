import { getAllBooksFlat, findBookById, type BibleBookLocal } from "./bible-data"

// API para conectar con Bolls Life API (Reina Valera 1960)
const API_BASE = "https://bolls.life"

export interface BibleBook {
  name: string
  abrev: string
  chapters: number
  testament: string
}

export interface Verse {
  number: string
  verse: string
  study?: string
  id?: string
}

export interface ChapterResponse {
  book: string
  chapter: string
  vers: Verse[]
  testament: string
  num_chapters: number
}

// Función auxiliar para limpiar HTML
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, "").trim()
}

// Obtener ID numérico para Bolls API
function getBollsBookId(bookNameOrId: string): number {
  const books = getAllBooksFlat()
  const normalized = bookNameOrId.toLowerCase().trim()
  
  // Mapeo especial para casos comunes si el ID no coincide directo
  const map: Record<string, string> = {
    "génesis": "genesis",
    "éxodo": "exodo",
    "levítico": "levitico",
    "números": "numeros",
    // ... otros con tildes si es necesario, aunque findBookById/ByName debería manejarlo
  }
  
  const searchId = map[normalized] || normalized
  
  const index = books.findIndex(b => 
    b.id === searchId || 
    b.nombre.toLowerCase() === normalized || 
    b.abreviatura.toLowerCase() === normalized ||
    normalizeBookName(normalized) === b.id
  )
  
  if (index === -1) {
    // Fallback: intentar buscar por nombre en el mapa existente
    const mappedName = bookNameMap[normalized]
    if (mappedName) {
      const idx = books.findIndex(b => b.id === mappedName)
      if (idx !== -1) return idx + 1
    }
    console.warn(`Libro no encontrado: ${bookNameOrId}, usando Génesis (1) por defecto`)
    return 1
  }
  
  return index + 1
}

// Obtener todos los libros de la Biblia (desde datos locales)
export async function getAllBooks(): Promise<BibleBook[]> {
  const books = getAllBooksFlat()
  return books.map(b => ({
    name: b.nombre,
    abrev: b.abreviatura,
    chapters: b.capitulos,
    testament: getTestament(b.id)
  }))
}

function getTestament(id: string): string {
  const books = getAllBooksFlat()
  const index = books.findIndex(b => b.id === id)
  return index < 39 ? "Antiguo Testamento" : "Nuevo Testamento"
}

// Obtener libros del Antiguo Testamento
export async function getOldTestamentBooks(): Promise<BibleBook[]> {
  const all = await getAllBooks()
  return all.filter(b => b.testament === "Antiguo Testamento")
}

// Obtener libros del Nuevo Testamento
export async function getNewTestamentBooks(): Promise<BibleBook[]> {
  const all = await getAllBooks()
  return all.filter(b => b.testament === "Nuevo Testamento")
}

// Obtener información de un libro específico
export async function getBookInfo(bookName: string): Promise<BibleBook> {
  const books = await getAllBooks()
  const normalized = normalizeBookName(bookName)
  const book = books.find(b => normalizeBookName(b.name) === normalized)
  if (!book) throw new Error(`Libro no encontrado: ${bookName}`)
  return book
}

interface BollsVerse {
  pk: number
  verse: number
  text: string
  comment?: string
}

// Obtener un capítulo completo (versión por defecto RV1960)
export async function getChapter(bookName: string, chapter: number): Promise<ChapterResponse> {
  const bookId = getBollsBookId(bookName)
  // Bolls API: https://bolls.life/get-text/RV1960/BOOK_ID/CHAPTER/
  const res = await fetch(`${API_BASE}/get-text/RV1960/${bookId}/${chapter}/`)
  
  if (!res.ok) throw new Error(`Error al cargar ${bookName} ${chapter}`)
  
  const bollsVerses: BollsVerse[] = await res.json()
  
  // Obtener info del libro para la respuesta
  const localBook = getAllBooksFlat()[bookId - 1]
  
  return {
    book: localBook.nombre,
    chapter: chapter.toString(),
    vers: bollsVerses.map(v => ({
      number: v.verse.toString(),
      verse: stripHtml(v.text),
      id: v.pk.toString()
    })),
    testament: bookId <= 39 ? "Antiguo Testamento" : "Nuevo Testamento",
    num_chapters: localBook.capitulos
  }
}

// Obtener un capítulo en una versión específica (ej: "nvi", "rv1960")
// Nota: Bolls soporta muchas versiones, mapeamos a las disponibles o fallback a RV1960
export async function getChapterWithVersion(
  version: string,
  bookName: string,
  chapter: number,
): Promise<ChapterResponse> {
  // Mapeo simple de versiones comunes a códigos Bolls
  const versionMap: Record<string, string> = {
    "rv1960": "RV1960",
    "nvi": "NVI", // Verificar si Bolls tiene NVI, si no usar RV1960
    "dhh": "DHH",
    "bla": "LBLA"
  }
  
  const bollsVersion = versionMap[version.toLowerCase()] || "RV1960"
  const bookId = getBollsBookId(bookName)
  
  const res = await fetch(`${API_BASE}/get-text/${bollsVersion}/${bookId}/${chapter}/`)
  if (!res.ok) throw new Error(`Error al cargar ${bookName} ${chapter} en ${version}`)
    
  const bollsVerses: BollsVerse[] = await res.json()
  const localBook = getAllBooksFlat()[bookId - 1]

  return {
    book: localBook.nombre,
    chapter: chapter.toString(),
    vers: bollsVerses.map(v => ({
      number: v.verse.toString(),
      verse: stripHtml(v.text),
      id: v.pk.toString()
    })),
    testament: bookId <= 39 ? "Antiguo Testamento" : "Nuevo Testamento",
    num_chapters: localBook.capitulos
  }
}

// Obtener un versículo específico
export async function getVerse(bookName: string, chapter: number, verse: number): Promise<Verse> {
  const chapterData = await getChapter(bookName, chapter)
  const v = chapterData.vers.find(v => v.number === verse.toString())
  if (!v) throw new Error(`Versículo no encontrado: ${bookName} ${chapter}:${verse}`)
  return v
}

// Obtener un rango de versículos (ej: 5-10)
export async function getVerseRange(
  bookName: string,
  chapter: number,
  startVerse: number,
  endVerse: number,
): Promise<Verse[]> {
  const chapterData = await getChapter(bookName, chapter)
  return chapterData.vers.filter(v => {
    const num = parseInt(v.number)
    return num >= startVerse && num <= endVerse
  })
}

// Mapeo de nombres amigables a nombres de API
export const bookNameMap: Record<string, string> = {
  // Antiguo Testamento
  génesis: "genesis",
  genesis: "genesis",
  éxodo: "exodo",
  exodo: "exodo",
  levítico: "levitico",
  levitico: "levitico",
  números: "numeros",
  numeros: "numeros",
  deuteronomio: "deuteronomio",
  josué: "josue",
  josue: "josue",
  jueces: "jueces",
  rut: "rut",
  "1 samuel": "1-samuel",
  "2 samuel": "2-samuel",
  "1 reyes": "1-reyes",
  "2 reyes": "2-reyes",
  "1 crónicas": "1-cronicas",
  "1 cronicas": "1-cronicas",
  "2 crónicas": "2-cronicas",
  "2 cronicas": "2-cronicas",
  esdras: "esdras",
  nehemías: "nehemias",
  nehemias: "nehemias",
  ester: "ester",
  job: "job",
  salmos: "salmos",
  proverbios: "proverbios",
  eclesiastés: "eclesiastes",
  eclesiastes: "eclesiastes",
  cantares: "cantares",
  isaías: "isaias",
  isaias: "isaias",
  jeremías: "jeremias",
  jeremias: "jeremias",
  lamentaciones: "lamentaciones",
  ezequiel: "ezequiel",
  daniel: "daniel",
  oseas: "oseas",
  joel: "joel",
  amós: "amos",
  amos: "amos",
  abdías: "abdias",
  abdias: "abdias",
  jonás: "jonas",
  jonas: "jonas",
  miqueas: "miqueas",
  nahúm: "nahum",
  nahum: "nahum",
  habacuc: "habacuc",
  sofonías: "sofonias",
  sofonias: "sofonias",
  hageo: "hageo",
  zacarías: "zacarias",
  zacarias: "zacarias",
  malaquías: "malaquias",
  malaquias: "malaquias",
  // Nuevo Testamento
  mateo: "mateo",
  marcos: "marcos",
  lucas: "lucas",
  juan: "juan",
  hechos: "hechos",
  romanos: "romanos",
  "1 corintios": "1-corintios",
  "2 corintios": "2-corintios",
  gálatas: "galatas",
  galatas: "galatas",
  efesios: "efesios",
  filipenses: "filipenses",
  colosenses: "colosenses",
  "1 tesalonicenses": "1-tesalonicenses",
  "2 tesalonicenses": "2-tesalonicenses",
  "1 timoteo": "1-timoteo",
  "2 timoteo": "2-timoteo",
  tito: "tito",
  filemón: "filemon",
  filemon: "filemon",
  hebreos: "hebreos",
  santiago: "santiago",
  "1 pedro": "1-pedro",
  "2 pedro": "2-pedro",
  "1 juan": "1-juan",
  "2 juan": "2-juan",
  "3 juan": "3-juan",
  judas: "judas",
  apocalipsis: "apocalipsis",
}

export function normalizeBookName(name: string): string {
  const normalized = name.toLowerCase().trim()
  return bookNameMap[normalized] || normalized.replace(/\s+/g, "-")
}

export interface SearchResult {
  pk: number
  translation: string
  book: number
  chapter: number
  verse: number
  text: string
}

export interface SearchResponse {
  exact_matches: number
  total: number
  results: SearchResult[]
  page: number
  total_pages: number
}

// Buscar en la Biblia
export async function searchBible(
  query: string, 
  version: string = "RV1960", 
  page: number = 1,
  limit: number = 20
): Promise<SearchResponse> {
  // Mapeo simple de versiones comunes a códigos Bolls
  const versionMap: Record<string, string> = {
    "rv1960": "RV1960",
    "nvi": "NVI",
    "dhh": "DHH",
    "bla": "LBLA"
  }
  
  const bollsVersion = versionMap[version.toLowerCase()] || "RV1960"
  
  const res = await fetch(
    `https://bolls.life/v2/find/${bollsVersion}?search=${encodeURIComponent(query)}&match_case=false&match_whole=false&limit=${limit}&page=${page}`
  )
  
  if (!res.ok) throw new Error(`Error al buscar "${query}" en ${version}`)
    
  const data = await res.json()
  
  return {
    exact_matches: data.exact_matches || 0,
    total: data.total || 0,
    results: data.results || [],
    page: page,
    total_pages: Math.ceil((data.total || 0) / limit)
  }
}
