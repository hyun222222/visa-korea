import { NextResponse } from 'next/server';
import { fillVisaApplicationForm, createDummyTemplate, VisaApplicationData } from '@/lib/pdf-generator';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const data: VisaApplicationData = body;

        // In production, use real template
        // const templatePath = path.join(process.cwd(), 'public', 'forms', 'integrated_application.pdf');

        // For now, use dummy if file doesn't exist
        let pdfBytes: Uint8Array;
        const templatePath = path.join(process.cwd(), 'public', 'forms', 'dummy_template.pdf');

        if (fs.existsSync(templatePath)) {
            pdfBytes = await fillVisaApplicationForm(data, templatePath);
        } else {
            // Create a dummy one on the fly for testing
            pdfBytes = await createDummyTemplate();
            // Optionally fill it again if we just created it empty? 
            // Actually createDummyTemplate returns a saved PDF. 
            // Let's just use the dummy generator's output which has fields created.
            // To properly test filling, we should save the dummy first then fill it.

            // Re-do: Create dummy template, save it, then fill it.
            const dummyTemplate = await createDummyTemplate();
            // Now fill it
            const pdfDoc = await import('pdf-lib').then(m => m.PDFDocument.load(dummyTemplate));
            const form = pdfDoc.getForm();
            form.getTextField('Name_Last_First')?.setText(data.fullName);
            form.getTextField('Passport_No')?.setText(data.passportNumber);
            form.getTextField('Nationality')?.setText(data.nationality);
            pdfBytes = await pdfDoc.save();
        }

        return new NextResponse(Buffer.from(pdfBytes), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="visa_application_${data.fullName}.pdf"`,
            },
        });
    } catch (error) {
        console.error('PDF Generation error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
