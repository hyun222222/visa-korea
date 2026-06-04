import MedicalVisaClient from "./MedicalVisaClient";

export default async function MedicalVisaPage({ params }: { params: Promise<{ lang: string }> }) {
    const resolvedParams = await params;
    return <MedicalVisaClient lang={resolvedParams.lang} />;
}

export function generateStaticParams() {
    return [
        { lang: "ko" },
        { lang: "en" },
        { lang: "zh" },
        { lang: "ja" }
    ];
}
