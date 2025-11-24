import { NextResponse } from 'next/server';
import { PdfGenerator } from '@/lib/pdf-generator';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { formId, data } = body;

        // In a real app, we would fetch the template from DB or storage
        // For now, we use the dummy generator or load from public/forms

        // const templatePath = path.join(process.cwd(), 'public', 'forms', 'dummy_template.pdf');
        // const templateBytes = fs.readFileSync(templatePath);

        // Using dummy generator for MVP
        const pdfBytes = await PdfGenerator.createDummyTemplate();

        // Convert Uint8Array to Buffer
        const buffer = Buffer.from(pdfBytes);

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="application_${formId}.pdf"`,
            },
        });
    } catch (error) {
        console.error('PDF Generation Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate PDF' },
            { status: 500 }
        );
    }
}
