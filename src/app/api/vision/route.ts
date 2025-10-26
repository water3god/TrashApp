import { NextResponse } from "next/server";
import vision from "@google-cloud/vision";

export async function POST(request: Request) {
    try {
        const { imageBase64 } = await request.json();

        if (!imageBase64) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        const client = new vision.ImageAnnotatorClient({
            keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        });

        const [result] = await client.labelDetection({
            image: { content: imageBase64 },
        });
        return NextResponse.json({ labels: result.labelAnnotations }, { status: 200 });

    } catch (error: unknown) {
        console.error('Error processing image:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}