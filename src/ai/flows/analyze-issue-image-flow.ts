"use server";

import { openai } from "@/lib/openai";

// 1. Function name ko analyzeIssueImage kiya taaki import errors solve ho jayein
export async function analyzeIssueImage(imageUrl: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // 2. "gpt-40-mini" ka typo fix karke "gpt-4o-mini" kiya
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
Analyse this civic issue image.
Return :
 - issue category
 - severity score (1-10)
 - urgency level
 - short civic summary
   `,
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl, // 3. Case mismatch (imageURL vs imageUrl) fix kiya
              },
            },
          ],
        },
      ],
    });

    return response.choices[0].message.content;
  } catch (error: any) {
    console.error("Error in analyzeIssueImage flow:", error);
    throw new Error(error.message || "Failed to analyze image with OpenAI.");
  }
}