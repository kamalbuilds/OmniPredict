import type { NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const results = await fetch(
      `https://tenor.googleapis.com/v2/search?q=${req.body}&key=${process.env.TENOR_KEY}&limit=35`
    );
    const json = await results.json();

    const res = NextResponse.json(json);

    return res;
  } catch (err: any) {
    console.error(err.message);
  }
}
