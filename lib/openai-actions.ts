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
