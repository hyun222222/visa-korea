import { VisaCalculators } from "@/components/calculators/VisaCalculators";
import { VisaRequirementsTable } from "@/components/calculators/VisaRequirementsTable";
import { FileText, Scale, Shield, BookOpen, Building2, MapPin, Phone, Mail } from "lucide-react";
import { FadeIn } from "@/components/ui/animate-wrapper";

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary/10 selection:text-primary">
            {/* Navigation Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <Scale className="h-6 w-6 text-primary" />
                            <span className="font-serif font-bold text-xl text-slate-900">Kim&Hyun Law</span>
                        </div>
                        <div className="hidden md:flex items-center gap-6">
                            <a href="#about" className="text-slate-600 hover:text-primary transition-colors font-medium">About</a>
                            <a href="#calculators" className="text-slate-600 hover:text-primary transition-colors font-medium">자격 자가진단</a>
                            <a href="#requirements" className="text-slate-600 hover:text-primary transition-colors font-medium">Requirements</a>
                            <a href="#contact" className="px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors">Get Started</a>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <div className="relative bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto py-20 px-4 sm:py-24 sm:px-6 lg:px-8">
                    <FadeIn className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center justify-center mb-6">
                            <Scale className="h-12 w-12 text-primary mb-4" />
                        </div>
                        <h1 className="text-4xl font-serif font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl mb-6 leading-tight">
                            Visa Korea <span className="text-primary">Legal Authority</span>
                        </h1>
                        <p className="mt-4 text-xl text-slate-600 leading-relaxed font-light">
                            Official visa eligibility assessment and strategic immigration planning.<br />
                            Verified by <strong>Kim&Hyun Law Office</strong>.
                        </p>
                        <div className="mt-8 flex justify-center gap-4">
                            <a href="#calculators" className="px-8 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors shadow-sm">
                                Check Eligibility
                            </a>
                            <a href="#about" className="px-8 py-3 bg-white border border-slate-300 text-slate-700 rounded-md font-medium hover:bg-slate-50 transition-colors shadow-sm">
                                About Us
                            </a>
                        </div>
                    </FadeIn>
                </div>
            </div>

            <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-24">
                {/* About Section */}
                <section id="about" className="scroll-mt-20">
                    <FadeIn>
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-12 text-white">
                            <div className="grid md:grid-cols-2 gap-12">
                                <div>
                                    <div className="inline-flex items-center gap-2 mb-6">
                                        <Building2 className="h-8 w-8 text-secondary" />
                                        <h2 className="text-3xl font-serif font-bold">Kim&Hyun Law Office</h2>
                                    </div>
                                    <p className="text-slate-300 text-lg leading-relaxed mb-6">
                                        We provide professional legal services in Korean immigration law, specializing in visa applications, residence permits, and naturalization matters.
                                    </p>
                                    <p className="text-slate-300 leading-relaxed">
                                        Our practice focuses on delivering accurate legal guidance based on current immigration regulations and assisting clients through complex administrative procedures.
                                    </p>
                                </div>
                                <div id="contact" className="space-y-4">
                                    <h3 className="text-xl font-serif font-bold mb-6">Contact Information</h3>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium">Office Location</p>
                                            <p className="text-slate-300">Seoul, South Korea</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium">Phone / WhatsApp</p>
                                            <a
                                                href="https://wa.me/821055346843"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-secondary hover:text-secondary/80 transition-colors"
                                            >
                                                010-5534-6843
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Mail className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium">Email</p>
                                            <a
                                                href="mailto:info@kimnhyun.com"
                                                className="text-secondary hover:text-secondary/80 transition-colors"
                                            >
                                                info@kimnhyun.com
                                            </a>
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-slate-700">
                                        <p className="text-sm text-slate-400">
                                            Licensed to practice law in the Republic of Korea.<br />
                                            Attorney advertising. Prior results do not guarantee similar outcomes.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </section>

                {/* Calculators Section */}
                <section id="calculators" className="scroll-mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-slate-900 sm:text-4xl mb-4">Visa Eligibility Assessment</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Use our legal tools to determine your eligibility for various Korean visa types based on the 2025 Immigration Control Act.
                        </p>
                    </div>
                    <VisaCalculators />
                </section>

                {/* Requirements Table Section */}
                <section id="requirements">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-slate-900 sm:text-4xl mb-4">Visa Requirements Library</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Comprehensive guide to visa types, purposes, and stay periods.
                        </p>
                    </div>
                    <VisaRequirementsTable />
                </section>

                {/* Features Grid */}
                <section>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <FadeIn delay={0.1} className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
                            <div className="h-10 w-10 text-secondary mb-4">
                                <BookOpen className="h-full w-full" />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-slate-900 mb-3">Statutory Compliance</h3>
                            <p className="text-slate-600 leading-relaxed">
                                All assessments are strictly based on the latest Ministry of Justice manuals and enforcement ordinances.
                            </p>
                        </FadeIn>

                        <FadeIn delay={0.2} className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
                            <div className="h-10 w-10 text-secondary mb-4">
                                <FileText className="h-full w-full" />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-slate-900 mb-3">Document Automation</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Generate official application forms (Form No. 34, etc.) formatted perfectly for submission.
                            </p>
                        </FadeIn>

                        <FadeIn delay={0.3} className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
                            <div className="h-10 w-10 text-secondary mb-4">
                                <Shield className="h-full w-full" />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-slate-900 mb-3">Attorney Verified</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Complex cases are flagged for review by our partner immigration attorneys at Kim&Hyun.
                            </p>
                        </FadeIn>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-primary rounded-xl overflow-hidden relative shadow-lg">
                    <div className="relative px-8 py-16 md:px-16 md:py-20 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-4 max-w-xl">
                            <h2 className="text-3xl font-serif font-bold text-white">Professional Legal Consultation</h2>
                            <p className="text-indigo-100 text-lg font-light">
                                For complex immigration matters, direct consultation with a licensed attorney is recommended.
                            </p>
                        </div>
                        <a
                            href="mailto:info@kimnhyun.com"
                            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-slate-50 transition-colors shadow-md"
                        >
                            Contact Kim&Hyun
                        </a>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-white mt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        {/* Law Office Info */}
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <Scale className="h-6 w-6 text-secondary" />
                                <span className="font-serif font-bold text-xl">Kim&Hyun Law Office</span>
                            </div>
                            <p className="text-slate-400 mb-4 leading-relaxed">
                                Professional legal services in Korean immigration law, administrative litigation, and legal consulting.
                            </p>
                            <p className="text-slate-500 text-sm">
                                Licensed to practice law in the Republic of Korea
                            </p>
                        </div>

                        {/* Legal Services */}
                        <div>
                            <h3 className="font-serif font-bold text-lg mb-4">Legal Services</h3>
                            <ul className="space-y-2 text-slate-400">
                                <li>Immigration & Visa Law</li>
                                <li>Administrative Litigation</li>
                                <li>Administrative Appeals</li>
                                <li>Legal Document Drafting</li>
                                <li>Legal Consultation</li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="font-serif font-bold text-lg mb-4">Contact</h3>
                            <ul className="space-y-2 text-slate-400">
                                <li>
                                    <a href="https://wa.me/821055346843" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                                        010-5534-6843
                                    </a>
                                </li>
                                <li>
                                    <a href="mailto:info@kimnhyun.com" className="hover:text-secondary transition-colors">
                                        info@kimnhyun.com
                                    </a>
                                </li>
                                <li className="text-slate-500 text-sm pt-2">
                                    Seoul, South Korea
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Legal Disclaimer */}
                    <div className="mt-12 pt-8 border-t border-slate-800">
                        <div className="bg-slate-800 rounded-lg p-6 mb-6">
                            <h4 className="font-semibold text-amber-400 mb-3 flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Important Legal Notice
                            </h4>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                The information provided on this website is for general reference purposes only and does not constitute legal advice.
                                The visa eligibility assessments and calculations are informational tools and have no legal binding effect.
                                For specific legal matters, please contact Kim&Hyun Law Office for professional consultation.
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                            <p>© {new Date().getFullYear()} Kim&Hyun Law Office. All rights reserved.</p>
                            <p>Attorney advertising. Prior results do not guarantee similar outcomes.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
