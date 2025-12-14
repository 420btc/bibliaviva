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

export async function chatWithBibleAI(messages: { role: "user" | "assistant" | "system"; content: string }[]) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres un asistente bíblico sabio, amable y teológicamente informado. Tu objetivo es ayudar a los usuarios a entender la Biblia, profundizar en su fe y responder preguntas teológicas con precisión y sensibilidad. Usa un lenguaje claro, alentador y respetuoso. Basa tus respuestas en las Escrituras. Si te preguntan algo fuera del contexto bíblico o espiritual, intenta relacionarlo suavemente con principios bíblicos o indica amablemente tu propósito."
        },
        ...messages
      ],
      max_tokens: 9000,
      temperature: 0.7,
    })

    return response.choices[0].message.content || "Lo siento, no pude generar una respuesta en este momento."
  } catch (error) {
    console.error("Error en chat IA:", error)
    throw new Error("No se pudo obtener respuesta del asistente")
  }
}
