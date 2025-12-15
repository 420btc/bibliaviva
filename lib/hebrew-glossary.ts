export interface HebrewTerm {
    term: string;
    transliteration: string;
    meaning: string;
    description: string;
    category: "nombres" | "lugares" | "conceptos" | "fiestas" | "títulos";
  }
  
  export const HEBREW_GLOSSARY: HebrewTerm[] = [
    // Nombres y Títulos Divinos
    {
      term: "Elohim",
      transliteration: "Elohim",
      meaning: "Dios (Poderoso/Jueces)",
      description: "Término hebreo genérico para Dios, enfatiza Su poder y justicia como Creador.",
      category: "títulos"
    },
    {
      term: "Adonai",
      transliteration: "Adonai",
      meaning: "Señor / Mi Maestro",
      description: "Título de respeto usado para sustituir el Nombre Sagrado (YHWH) en la lectura.",
      category: "títulos"
    },
    {
      term: "Yeshua",
      transliteration: "Yeshua",
      meaning: "Salvación",
      description: "Nombre hebreo original de Jesús. Proviene de la raíz 'yasha' (salvar).",
      category: "nombres"
    },
    {
      term: "Mashiaj",
      transliteration: "Mashiaj",
      meaning: "Ungido",
      description: "La palabra hebrea para 'Mesías' (Cristo en griego). Se refiere al Rey ungido por Dios.",
      category: "títulos"
    },
    {
      term: "Ruaj HaKodesh",
      transliteration: "Ruaj HaKodesh",
      meaning: "El Espíritu Santo",
      description: "Literalmente 'Viento/Aliento de Santidad'. La presencia activa de Dios.",
      category: "títulos"
    },
    {
      term: "Abba",
      transliteration: "Abba",
      meaning: "Papá / Padre",
      description: "Término arameo de intimidad y cariño para referirse al Padre.",
      category: "títulos"
    },
  
    // Personajes Bíblicos
    {
      term: "Moshé",
      transliteration: "Moshé",
      meaning: "Sacado (de las aguas)",
      description: "Nombre hebreo de Moisés.",
      category: "nombres"
    },
    {
      term: "Miriam",
      transliteration: "Miriam",
      meaning: "Amargura / Rebelión",
      description: "Nombre hebreo original de María.",
      category: "nombres"
    },
    {
      term: "Yaakov",
      transliteration: "Yaakov",
      meaning: "Suplantador / El que sostiene el talón",
      description: "Nombre hebreo de Jacob y también de Santiago (Jacobo).",
      category: "nombres"
    },
    {
      term: "Yojanán",
      transliteration: "Yojanán",
      meaning: "Dios es misericordioso",
      description: "Nombre hebreo de Juan.",
      category: "nombres"
    },
    {
      term: "Kefa",
      transliteration: "Kefa",
      meaning: "Roca",
      description: "Nombre arameo de Pedro (Cefas).",
      category: "nombres"
    },
    {
      term: "Shaúl",
      transliteration: "Shaúl",
      meaning: "Pedido / Solicitado",
      description: "Nombre hebreo del Apóstol Pablo (Saulo).",
      category: "nombres"
    },
  
    // Conceptos
    {
      term: "Torá",
      transliteration: "Torah",
      meaning: "Instrucción / Enseñanza",
      description: "Mal traducido a veces como 'Ley'. Se refiere a los 5 libros de Moisés y la instrucción divina.",
      category: "conceptos"
    },
    {
      term: "Shalom",
      transliteration: "Shalom",
      meaning: "Paz / Completitud",
      description: "Más que ausencia de guerra, es bienestar total, salud, prosperidad y armonía.",
      category: "conceptos"
    },
    {
      term: "Teshuvá",
      transliteration: "Teshuvá",
      meaning: "Retorno / Arrepentimiento",
      description: "Volver a Dios. No solo sentirse mal, sino cambiar de dirección.",
      category: "conceptos"
    },
    {
      term: "Emuná",
      transliteration: "Emuná",
      meaning: "Fe / Fidelidad / Firmeza",
      description: "No es solo creer mentalmente, sino actuar con fidelidad y confianza firme.",
      category: "conceptos"
    },
    {
      term: "Kehilá",
      transliteration: "Kehilá",
      meaning: "Congregación / Asamblea",
      description: "Término hebreo para 'Iglesia'. Comunidad de creyentes.",
      category: "conceptos"
    },
    {
      term: "Brit Jadashá",
      transliteration: "Brit Jadashá",
      meaning: "Pacto Renovado / Nuevo Pacto",
      description: "Término hebreo para el Nuevo Testamento.",
      category: "conceptos"
    },
    {
      term: "Tanaj",
      transliteration: "Tanaj",
      meaning: "Antiguo Testamento",
      description: "Acrónimo de Torá (Ley), Neviím (Profetas) y Ketuvím (Escritos).",
      category: "conceptos"
    },
    {
      term: "Haleluyah",
      transliteration: "Haleluyah",
      meaning: "Alabad a Yah",
      description: "Exclamación de alabanza a Dios (Yah es una forma corta del Nombre).",
      category: "conceptos"
    },
    {
      term: "Amén",
      transliteration: "Amén",
      meaning: "Así sea / Verdad",
      description: "Afirmación de certeza y confianza.",
      category: "conceptos"
    },
  
    // Fiestas y Tiempos
    {
      term: "Shabat",
      transliteration: "Shabat",
      meaning: "Cese / Descanso",
      description: "El séptimo día de descanso (Sábado), señal del pacto y tiempo sagrado.",
      category: "fiestas"
    },
    {
      term: "Pésaj",
      transliteration: "Pésaj",
      meaning: "Pasar por alto / Pascua",
      description: "Fiesta de la liberación de Egipto.",
      category: "fiestas"
    },
    {
      term: "Shavuot",
      transliteration: "Shavuot",
      meaning: "Semanas / Pentecostés",
      description: "Fiesta de la entrega de la Torá y del Espíritu Santo.",
      category: "fiestas"
    },
    {
      term: "Sucot",
      transliteration: "Sucot",
      meaning: "Cabañas / Tabernáculos",
      description: "Fiesta de la cosecha y recuerdo del desierto.",
      category: "fiestas"
    },
    {
      term: "Yom Kipur",
      transliteration: "Yom Kipur",
      meaning: "Día de la Expiación",
      description: "El día más sagrado del año judío, dedicado al ayuno y arrepentimiento.",
      category: "fiestas"
    },
    {
      term: "Rosh Hashaná",
      transliteration: "Rosh Hashaná",
      meaning: "Cabeza del Año",
      description: "Año Nuevo Judío y Día de las Trompetas.",
      category: "fiestas"
    },
    {
      term: "Janucá",
      transliteration: "Janucá",
      meaning: "Dedicación",
      description: "Fiesta de las Luces (no bíblica en el Tanaj, pero mencionada en Juan 10:22).",
      category: "fiestas"
    },
  
    // Lugares
    {
      term: "Yerushalayim",
      transliteration: "Yerushalayim",
      meaning: "Ciudad de Paz",
      description: "Nombre hebreo de Jerusalén.",
      category: "lugares"
    },
    {
      term: "Tzion",
      transliteration: "Tzion",
      meaning: "Sion",
      description: "Monte sagrado en Jerusalén, símbolo del Reino de Dios.",
      category: "lugares"
    },
    {
      term: "Yisrael",
      transliteration: "Yisrael",
      meaning: "El que lucha con Dios",
      description: "Nombre del pueblo y la tierra de Israel.",
      category: "lugares"
    },
    {
      term: "Bet Lehem",
      transliteration: "Bet Lehem",
      meaning: "Casa de Pan",
      description: "Nombre hebreo de Belén.",
      category: "lugares"
    }
  ];
  
  export function searchGlossary(query: string): HebrewTerm[] {
    const q = query.toLowerCase();
    return HEBREW_GLOSSARY.filter(item => 
      item.term.toLowerCase().includes(q) || 
      item.transliteration.toLowerCase().includes(q) || 
      item.meaning.toLowerCase().includes(q)
    );
  }
