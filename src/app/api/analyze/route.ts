import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // OpenAI Vision API call (civic issue check karne ke liye)
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Ya fir "gpt-4-turbo" jo bhi aap use kar rahi ho
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Identify if there is any pothole or garbage in this image. Give a brief summary." },
            {
              type: "image_url",
              image_url: {
                url: image, // Base64 image string passes here
              },
            },
          ],
        },
      ],
    });

    return NextResponse.json({ result: response.choices[0].message.content });
  } catch (error: any) {
    console.error("OpenAI Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}