import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, model, key } = await req.json();

    if (!prompt || !model || !key) {
      return NextResponse.json(
        { error: "Missing required fields: prompt, model, or key" },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/complete", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        model,
        max_tokens_to_sample: 500,
        stop_sequences: ["\n"],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: "Failed to fetch from Claude API", details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in POST handler:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
