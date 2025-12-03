import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  return (
    <section className="max-w-3xl mx-auto px-6 mb-32">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-white">Sıkça Sorulan Sorular</h2>
      </div>
      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem
          value="q1"
          className="border border-slate-800 bg-slate-900/30 px-4 rounded-lg"
        >
          <AccordionTrigger className="text-slate-200 hover:text-indigo-400 hover:no-underline">
            Verilerim güvende mi?
          </AccordionTrigger>
          <AccordionContent className="text-slate-400">
            Kesinlikle. NextAuth ile güvenli oturum yönetimi sağlıyoruz.
            Verileriniz Neon DB üzerinde şifrelenmiş olarak saklanır ve üçüncü
            şahıslarla paylaşılmaz.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="q2"
          className="border border-slate-800 bg-slate-900/30 px-4 rounded-lg"
        >
          <AccordionTrigger className="text-slate-200 hover:text-indigo-400 hover:no-underline">
            Proje ücretli mi?
          </AccordionTrigger>
          <AccordionContent className="text-slate-400">
            Hayır. CareerAI bir bitirme projesi kapsamında geliştirilmiştir ve
            şu an için tamamen ücretsizdir.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="q3"
          className="border border-slate-800 bg-slate-900/30 px-4 rounded-lg"
        >
          <AccordionTrigger className="text-slate-200 hover:text-indigo-400 hover:no-underline">
            Hangi dosya formatlarını destekliyor?
          </AccordionTrigger>
          <AccordionContent className="text-slate-400">
            Şu an için sadece PDF ve DOCX formatındaki CV&apos;leri
            destekliyoruz. En iyi analiz sonuçları için metin tabanlı (taranmış
            resim olmayan) PDF&apos;ler önerilir.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
