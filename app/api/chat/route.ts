import { OpenAIStream, StreamingTextResponse } from "ai"
import { Configuration, OpenAIApi } from "openai-edge"

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(config)

export async function POST(req: Request) {
  const { messages } = await req.json()

  const response = await openai.createChatCompletion({
    model: "gpt-4",
    stream: true,
    messages: [
      {
        role: "system",
        content: `You are a helpful study assistant. Your goal is to help students learn effectively by:
        - Asking guiding questions rather than providing direct answers
        - Helping break down complex topics into manageable chunks
        - Providing study techniques and memory aids
        - Offering encouragement and motivation
        Do not solve problems for the student, but help them develop their own understanding.`,
      },
      ...messages,
    ],
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}

