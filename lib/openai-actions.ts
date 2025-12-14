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
