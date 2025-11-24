import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface FormField {
    page: number;
    x: number;
    y: number;
    value: string;
    fontSize?: number;
}

export class PdfGenerator {
    static async generateForm(templateBytes: ArrayBuffer, fields: FormField[]): Promise<Uint8Array> {
        const pdfDoc = await PDFDocument.load(templateBytes);
        const pages = pdfDoc.getPages();

        // Embed font (Standard Helvetica for now)
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        for (const field of fields) {
            if (field.page >= pages.length) continue;

            const page = pages[field.page];

            // Draw text using bottom-left coordinates (standard PDF)
            page.drawText(field.value, {
                x: field.x,
                y: field.y,
                size: field.fontSize || 10,
                font: font,
                color: rgb(0, 0, 0),
            });
        }

        return await pdfDoc.save();
    }

    static async createDummyTemplate(): Promise<Uint8Array> {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        page.drawText('Integrated Application Form (Visa Korea)', {
            x: 50,
            y: height - 50,
            size: 20,
            font,
        });

        page.drawText('Name:', { x: 50, y: height - 100, size: 12, font });
        page.drawRectangle({ x: 100, y: height - 110, width: 200, height: 20, borderColor: rgb(0, 0, 0), borderWidth: 1 });

        page.drawText('Passport No:', { x: 50, y: height - 140, size: 12, font });
        page.drawRectangle({ x: 150, y: height - 150, width: 150, height: 20, borderColor: rgb(0, 0, 0), borderWidth: 1 });

        return await pdfDoc.save();
    }
}
