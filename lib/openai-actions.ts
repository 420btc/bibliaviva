"use server"

import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateVerseImage(verseText: string) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Una imagen artística, espiritual y serena que represente este versículo bíblico: "${verseText}". Estilo pintura al óleo suave, luz divina, inspirador. Sin texto.`,
      n: 1,
      size: "1024x1024",
    })

    if (!response.data || !response.data[0]) {
      throw new Error("No se recibió imagen de OpenAI")
    }

    return { url: response.data[0].url }
  } catch (error) {
    console.error("Error generating image:", error)
    throw new Error("No se pudo generar la imagen")
  }
}

export async function generateVerseAudio(verseText: string, voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" = "onyx") {
  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice,
      input: verseText,
    })

    const buffer = Buffer.from(await mp3.arrayBuffer())
    return { audio: buffer.toString("base64") }
  } catch (error) {
    console.error("Error generating audio:", error)
    throw new Error("No se pudo generar el audio")
  }
}

export async function getGeographicContext(book: string, chapter: number) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Eres un experto geógrafo e historiador bíblico. Tu tarea es analizar el capítulo ${chapter} del libro de ${book} y extraer los lugares geográficos mencionados o relevantes para el contexto. 
          Devuelve SOLO un objeto JSON válido con la siguiente estructura:
          {
            "locations": [
              {
                "name": "Nombre del lugar",
                "description": "Breve descripción histórica/bíblica de 1-2 frases sobre su relevancia en este capítulo.",
                "coordinates": { "lat": 31.7683, "lng": 35.2137 } (Coordenadas aproximadas reales),
                "type": "city" | "mountain" | "river" | "region" | "other"
              }
            ],
            "summary": "Un resumen muy breve (max 30 palabras) del movimiento geográfico en este capítulo."
          }
          Si no hay lugares mencionados, devuelve una lista vacía y un resumen indicando que es un pasaje sin movimiento geográfico específico.`
        },
        {
          role: "user",
          content: `Analiza ${book} capítulo ${chapter}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    })

    const content = response.choices[0].message.content
    if (!content) return null
    return JSON.parse(content)
  } catch (error) {
    console.error("Error getting geographic context:", error)
    return { locations: [], summary: "No se pudo cargar el contexto geográfico." }
  }
}

export async function chatWithBibleAI(messages: { role: "user" | "assistant" | "system"; content: string }[]) {
  try {
    const tools = [
      {
        type: "function" as const,
        function: {
          name: "generate_image",
          description: "Generar una imagen bíblica o espiritual basada en una descripción. Úsalo cuando el usuario pida explícitamente una imagen, dibujo, pintura o visualización.",
          parameters: {
            type: "object",
            properties: {
              prompt: {
                type: "string",
                description: "Descripción detallada de la imagen a generar."
              }
            },
            required: ["prompt"]
          }
        }
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres un asistente bíblico sabio, amable y teológicamente informado. Tu objetivo es ayudar a los usuarios a entender la Biblia, profundizar en su fe y responder preguntas teológicas con precisión y sensibilidad. Usa un lenguaje claro, alentador y respetuoso. Basa tus respuestas en las Escrituras. Si te preguntan algo fuera del contexto bíblico o espiritual, intenta relacionarlo suavemente con principios bíblicos o indica amablemente tu propósito. Si el usuario pide una imagen, usa la función generate_image."
        },
        ...messages
      ],
      tools: tools,
      tool_choice: "auto",
      max_tokens: 1000, // Reduced max tokens for chat, keep 1000-2000 is usually enough
      temperature: 0.7,
    })

    const responseMessage = response.choices[0].message;

    // Check if the model wanted to call a function
    if (responseMessage.tool_calls) {
      const toolCall = responseMessage.tool_calls[0];
      if (toolCall.type === 'function' && toolCall.function.name === "generate_image") {
        const args = JSON.parse(toolCall.function.arguments);
        const imageUrl = await generateVerseImage(args.prompt); // Reusing existing function which returns { url }
        return `Aquí tienes la imagen que pediste:\n\n[IMAGE_URL:${imageUrl.url}]`;
      }
    }

    return responseMessage.content || "Lo siento, no pude generar una respuesta en este momento."
  } catch (error) {
    console.error("Error en chat IA:", error)
    throw new Error("No se pudo obtener respuesta del asistente")
  }
}

export type StudyMode =
  | "resumen"
  | "explicacion"
  | "aplicacion"
  | "oracion"
  | "preguntas"
  | "contexto"
  | "referencias"

export interface StudyResponse {
  title: string
  resumen: string
  explicacion: string
  puntosClave: string[]
  aplicaciones: string[]
  preguntas: string[]
  referenciasCruzadas: string[]
  oracion: string
}

export async function studyBiblePassage(input: {
  reference: string
  text: string
  mode: StudyMode
  version?: string
}) {
  const { reference, text, mode, version } = input

  const modeHints: Record<StudyMode, string> = {
    resumen: "Prioriza un resumen claro y corto.",
    explicacion: "Prioriza explicación versículo a versículo si aplica, sin tecnicismos excesivos.",
    aplicacion: "Prioriza aplicaciones prácticas, concretas y realistas.",
    oracion: "Prioriza una oración breve, reverente y relacionada al pasaje.",
    preguntas: "Prioriza preguntas de reflexión y estudio en grupo.",
    contexto: "Prioriza contexto histórico/cultural/literario con precisión y cautela.",
    referencias: "Prioriza referencias cruzadas bíblicas relevantes y justificadas.",
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Eres un asistente bíblico experto, sobrio y preciso. Responde en español, sin inventar datos. Si algo es incierto, dilo con cautela. Devuelve SOLO JSON válido con esta estructura exacta: {\"title\":string,\"resumen\":string,\"explicacion\":string,\"puntosClave\":string[],\"aplicaciones\":string[],\"preguntas\":string[],\"referenciasCruzadas\":string[],\"oracion\":string}. Mantén el estilo minimalista: frases cortas, bullets directos, sin relleno.",
        },
        {
          role: "user",
          content: [
            `Referencia: ${reference}`,
            version ? `Versión: ${version}` : null,
            `Modo: ${mode} (${modeHints[mode]})`,
            "Texto:",
            text,
          ]
            .filter(Boolean)
            .join("\n"),
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 900,
    })

    const content = response.choices[0].message.content
    if (!content) throw new Error("Respuesta vacía")

    const parsed = JSON.parse(content) as StudyResponse
    return parsed
  } catch (error) {
    console.error("Error en estudio IA:", error)
    throw new Error("No se pudo generar el estudio del pasaje")
  }
}
