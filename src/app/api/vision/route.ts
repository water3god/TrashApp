import { NextResponse } from "next/server";
import vision from "@google-cloud/vision";

function createVisionClient() {
    const rawCredentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    if (rawCredentials) {
        return new vision.ImageAnnotatorClient({
            credentials: JSON.parse(rawCredentials),
        });
    }

    const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (keyFilename) {
        return new vision.ImageAnnotatorClient({ keyFilename });
    }

    throw new Error(
        "Missing Google credentials. Set GOOGLE_SERVICE_ACCOUNT_KEY on Vercel or GOOGLE_APPLICATION_CREDENTIALS locally."
    );
}

export async function POST(request: Request) {
    try {
        const { imageBase64 } = await request.json();

        if (!imageBase64) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        const client = createVisionClient();

        const [result] = await client.labelDetection({
            image: { content: imageBase64 },
        });
        return NextResponse.json({ labels: result.labelAnnotations }, { status: 200 });

    } catch (error: unknown) {
        console.error('Error processing image:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}