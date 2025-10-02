import { ChatApiRequest, ChatMessage } from '@/components/chatbot/types/chat';
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

/* eslint-disable @typescript-eslint/no-explicit-any */


// 1. Initialize the Google GenAI Client
// The API key is automatically read from the GEMINI_API_KEY environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const modelName = 'gemini-2.5-flash'; // Excellent for conversational chat

/**
 * Helper function to map our custom ChatMessage[] history to the Gemini SDK's Content[] format.
 * The Gemini SDK expects messages grouped by 'role' and 'parts'.
 * Note: We filter out the 'timestamp' property here as the SDK doesn't need it.
 */
function mapHistoryToGeminiContent(history: ChatMessage[]): any[] {
  // The SDK uses a different type for Content[] than our simple ChatMessage.
  // We need to map role: 'user'/'model' and content: string to { role, parts: [{ text: content }] }
  return history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }));
}

export async function POST(req: Request) {
  // Check for API Key security first
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY is not configured.' },
      { status: 500 }
    );
  }

  try {
    // 2. Parse and Validate the Request Body
    const body: ChatApiRequest = await req.json();
    const { history } = body;

    if (!history || history.length === 0) {
      return NextResponse.json(
        { error: 'Conversation history is required.' },
        { status: 400 }
      );
    }

    // 3. Convert history to the format expected by the Google SDK
    const contents = mapHistoryToGeminiContent(history);
    
    // 4. Start the streaming generation
    const responseStream = await ai.models.generateContentStream({
      model: modelName,
      contents: contents, // Pass the full history for context
    });
    
    // --- Proceed to Step 2.3: Implement Streaming Logic 
    // ... continuing inside POST(req: Request) from above ...

    // 4. Start the streaming generation (Already done above)
    // const responseStream = await ai.models.generateContentStream({...});

    // 5. Create a Web Stream to pipe the Gemini response to the client
    const encoder = new TextEncoder();
    
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          // Iterate through the streamed response from the Gemini API
          for await (const chunk of responseStream) {
            // The chunk.text contains the generated text segment
            const textChunk = chunk.text;

            // Send the text chunk to the client
            controller.enqueue(encoder.encode(textChunk));
          }
        } catch (error) {
          console.error('Error during streaming:', error);
          // If an error occurs, send an error message and close the stream
          controller.error(error); 
        } finally {
          // Close the stream once generation is complete
          controller.close();
        }
      },
    });

    // 6. Return the streaming response using the standard Web API Response
    return new Response(readableStream, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8', // Important header for streaming text
      },
    });

  } catch (error) {
    // 7. General Error Handling
    console.error('API Error:', error);
    // Return a JSON error for non-stream errors (e.g., failed parsing)
    return NextResponse.json(
      { error: 'Failed to process request.', details: (error as Error).message },
      { status: 500 }
    );
  }
}