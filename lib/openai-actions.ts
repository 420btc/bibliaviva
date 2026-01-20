"use server"

function envOrDefault(name: string, fallback: string) {
  const value = process.env[name]
  if (!value) return fallback
  const trimmed = value.trim()
  return trimmed.length ? trimmed : fallback
}

const OPENAI_MODELS = {
  chat: envOrDefault("OPENAI_CHAT_MODEL", "gpt-5-nano"),
  study: envOrDefault("OPENAI_STUDY_MODEL", "gpt-5-mini"),
  geo: envOrDefault("OPENAI_GEO_MODEL", "gpt-5-nano"),
  image: envOrDefault("OPENAI_IMAGE_MODEL", "gpt-image-1-mini"),
  tts: envOrDefault("OPENAI_TTS_MODEL", "tts-1"),
  transcribe: envOrDefault("OPENAI_TRANSCRIBE_MODEL", "whisper-1"),
}

const FALLBACK_MODELS = {
  chat: envOrDefault("OPENAI_CHAT_FALLBACK_MODEL", "gpt-4o-mini"),
  study: envOrDefault("OPENAI_STUDY_FALLBACK_MODEL", "gpt-4o-mini"),
  geo: envOrDefault("OPENAI_GEO_FALLBACK_MODEL", "gpt-4o-mini"),
  image: envOrDefault("OPENAI_IMAGE_FALLBACK_MODEL", "dall-e-3"),
  transcribe: envOrDefault("OPENAI_TRANSCRIBE_FALLBACK_MODEL", "whisper-1"),
}

let openaiClient: unknown | null = null

async function getOpenAIClient() {
  if (openaiClient) return openaiClient as any
  const mod = await import("openai")
  const OpenAI = (mod as any).default
  openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  return openaiClient as any
}

function hasOpenAIKey() {
  const key = process.env.OPENAI_API_KEY
  return typeof key === "string" && key.trim().length > 0
}

function getOpenAIErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") return ""
  const anyErr = error as { message?: unknown; error?: unknown }
  if (typeof anyErr.message === "string") return anyErr.message
  const inner = anyErr.error as { message?: unknown } | undefined
  if (inner && typeof inner.message === "string") return inner.message
  return ""
}

function shouldTryFallbackModel(error: unknown) {
  if (!error || typeof error !== "object") return false
  const anyErr = error as { status?: unknown; code?: unknown }
  const status = typeof anyErr.status === "number" ? anyErr.status : undefined
  if (status && [400, 401, 403, 404].includes(status)) return true
  const code = typeof anyErr.code === "string" ? anyErr.code : undefined
  if (code && ["model_not_found", "invalid_api_key", "insufficient_quota"].includes(code)) return true
  const msg = getOpenAIErrorMessage(error).toLowerCase()
  return (
    msg.includes("model") ||
    msg.includes("not found") ||
    msg.includes("does not exist") ||
    msg.includes("doesn't exist") ||
    msg.includes("access") ||
    msg.includes("permission") ||
    msg.includes("insufficient_quota") ||
    msg.includes("quota") ||
    msg.includes("api key") ||
    msg.includes("invalid") ||
    msg.includes("verification") ||
    msg.includes("verify")
  )
}

function pickImageResponseFormat(model: string): "url" | "b64_json" {
  const m = (model || "").toLowerCase()
  if (m.includes("gpt-image")) return "b64_json"
  if (m.includes("dall-e")) return "url"
  return "url"
}

function pickImageSize(format: "url" | "b64_json"): "256x256" | "512x512" | "1792x1024" {
  return format === "b64_json" ? "256x256" : "1792x1024"
}

export async function generateVerseImage(verseText: string) {
  if (!hasOpenAIKey()) {
    return { url: null, error: "OPENAI_API_KEY no está configurada en el servidor." }
  }

  const prompt = `Una imagen artística, espiritual y serena que represente este versículo bíblico: "${verseText}". Estilo pintura al óleo suave, luz divina, inspirador. Sin texto.`
  const openai = await getOpenAIClient()

  const tryGenerate = async (model: string) => {
    const response_format = pickImageResponseFormat(model)
    const size = pickImageSize(response_format)
    const response = await (openai as any).images.generate({
      model,
      prompt,
      n: 1,
      size,
      response_format,
    })

    if (!response?.data?.[0]) {
      return { url: null, error: "No se recibió imagen de OpenAI" as string }
    }

    const first = response.data[0]
    if ("url" in first && first.url) return { url: first.url as string, error: null as string | null }
    if ("b64_json" in first && first.b64_json) return { url: `data:image/png;base64,${first.b64_json}`, error: null as string | null }
    return { url: null, error: "La respuesta de imagen no contiene datos utilizables" as string }
  }

  try {
    const res = await tryGenerate(OPENAI_MODELS.image)
    if (res.url) return { url: res.url }
    return { url: null, error: res.error || "No se pudo generar la imagen" }
  } catch (error) {
    const primaryDetails = getOpenAIErrorMessage(error)

    if (OPENAI_MODELS.image === FALLBACK_MODELS.image) {
      console.error("Error generating image:", error)
      return { url: null, error: primaryDetails || "No se pudo generar la imagen" }
    }

    try {
      const res = await tryGenerate(FALLBACK_MODELS.image)
      if (res.url) return { url: res.url }
      return { url: null, error: res.error || primaryDetails || "No se pudo generar la imagen" }
    } catch (fallbackError) {
      console.error("Error generating image (fallback):", fallbackError)
      const details = getOpenAIErrorMessage(fallbackError) || primaryDetails
      return { url: null, error: details || "No se pudo generar la imagen" }
    }
  }
}

export async function generateVerseAudio(verseText: string, voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" = "onyx") {
  if (!hasOpenAIKey()) {
    return { audio: null, error: "OPENAI_API_KEY no está configurada en el servidor." }
  }

  try {
    const openai = await getOpenAIClient()
    const mp3 = await openai.audio.speech.create({
      model: OPENAI_MODELS.tts,
      voice: voice,
      input: verseText,
    })

    const buffer = Buffer.from(await mp3.arrayBuffer())
    return { audio: buffer.toString("base64") }
  } catch (error) {
    console.error("Error generating audio:", error)
    return { audio: null, error: "No se pudo generar el audio" }
  }
}

export async function transcribeAudio(formData: FormData) {
  if (!hasOpenAIKey()) {
    return { text: null, error: "OPENAI_API_KEY no está configurada en el servidor." }
  }

  const file = formData.get("audio")
  if (!file || !(file instanceof File)) {
    return { text: null, error: "Audio no válido." }
  }

  try {
    const openai = await getOpenAIClient()
    const res = await openai.audio.transcriptions.create({
      model: OPENAI_MODELS.transcribe,
      file,
    })
    const text = typeof res?.text === "string" ? res.text.trim() : ""
    return { text: text.length ? text : null }
  } catch (error) {
    if (!shouldTryFallbackModel(error) || OPENAI_MODELS.transcribe === FALLBACK_MODELS.transcribe) {
      console.error("Error transcribing audio:", error)
      return { text: null, error: "No se pudo transcribir el audio" }
    }

    try {
      const openai = await getOpenAIClient()
      const res = await openai.audio.transcriptions.create({
        model: FALLBACK_MODELS.transcribe,
        file,
      })
      const text = typeof res?.text === "string" ? res.text.trim() : ""
      return { text: text.length ? text : null }
    } catch (fallbackError) {
      console.error("Error transcribing audio (fallback):", fallbackError)
      return { text: null, error: "No se pudo transcribir el audio" }
    }
  }
}

export async function getGeographicContext(book: string, chapter: number) {
  if (!hasOpenAIKey()) {
    return { locations: [], summary: "Falta OPENAI_API_KEY en el servidor." }
  }

  try {
    const openai = await getOpenAIClient()
    const response = await openai.chat.completions.create({
      model: OPENAI_MODELS.geo,
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
  if (!hasOpenAIKey()) {
    return "No puedo usar la IA ahora: falta OPENAI_API_KEY en el servidor."
  }

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

  try {
    const openai = await getOpenAIClient()
    const response = await openai.chat.completions.create({
      model: OPENAI_MODELS.chat,
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
        const image = await generateVerseImage(args.prompt);
        if (!image.url) return "No se pudo generar la imagen en este momento."
        return `Aquí tienes la imagen que pediste:\n\n[IMAGE_URL:${image.url}]`;
      }
    }

    return responseMessage.content || "Lo siento, no pude generar una respuesta en este momento."
  } catch (error) {
    if (!shouldTryFallbackModel(error) || OPENAI_MODELS.chat === FALLBACK_MODELS.chat) {
      console.error("Error en chat IA:", error)
      return "No se pudo obtener respuesta del asistente en este momento."
    }

    try {
      const openai = await getOpenAIClient()
      const response = await openai.chat.completions.create({
        model: FALLBACK_MODELS.chat,
        messages: [
          {
            role: "system",
            content: "Eres un asistente bíblico sabio, amable y teológicamente informado. Tu objetivo es ayudar a los usuarios a entender la Biblia, profundizar en su fe y responder preguntas teológicas con precisión y sensibilidad. Usa un lenguaje claro, alentador y respetuoso. Basa tus respuestas en las Escrituras. Si te preguntan algo fuera del contexto bíblico o espiritual, intenta relacionarlo suavemente con principios bíblicos o indica amablemente tu propósito. Si el usuario pide una imagen, usa la función generate_image."
          },
          ...messages
        ],
        tools: tools,
        tool_choice: "auto",
        max_tokens: 1000,
        temperature: 0.7,
      })

      const responseMessage = response.choices[0].message;

      if (responseMessage.tool_calls) {
        const toolCall = responseMessage.tool_calls[0];
        if (toolCall.type === 'function' && toolCall.function.name === "generate_image") {
          const args = JSON.parse(toolCall.function.arguments);
          const image = await generateVerseImage(args.prompt);
          if (!image.url) return "No se pudo generar la imagen en este momento."
          return `Aquí tienes la imagen que pediste:\n\n[IMAGE_URL:${image.url}]`;
        }
      }

      return responseMessage.content || "Lo siento, no pude generar una respuesta en este momento."
    } catch (fallbackError) {
      console.error("Error en chat IA (fallback):", fallbackError)
      return "No se pudo obtener respuesta del asistente en este momento."
    }
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

  if (!hasOpenAIKey()) {
    return {
      title: reference,
      resumen: "Falta OPENAI_API_KEY en el servidor.",
      explicacion: "",
      puntosClave: [],
      aplicaciones: [],
      preguntas: [],
      referenciasCruzadas: [],
      oracion: "",
    } satisfies StudyResponse
  }

  try {
    const openai = await getOpenAIClient()
    const response = await openai.chat.completions.create({
      model: OPENAI_MODELS.study,
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
    if (!shouldTryFallbackModel(error) || OPENAI_MODELS.study === FALLBACK_MODELS.study) {
      console.error("Error en estudio IA:", error)
      return {
        title: reference,
        resumen: "No se pudo generar el estudio del pasaje.",
        explicacion: "",
        puntosClave: [],
        aplicaciones: [],
        preguntas: [],
        referenciasCruzadas: [],
        oracion: "",
      } satisfies StudyResponse
    }

    try {
      const openai = await getOpenAIClient()
      const response = await openai.chat.completions.create({
        model: FALLBACK_MODELS.study,
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
    } catch (fallbackError) {
      console.error("Error en estudio IA (fallback):", fallbackError)
      return {
        title: reference,
        resumen: "No se pudo generar el estudio del pasaje.",
        explicacion: "",
        puntosClave: [],
        aplicaciones: [],
        preguntas: [],
        referenciasCruzadas: [],
        oracion: "",
      } satisfies StudyResponse
    }
  }
}
