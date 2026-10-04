import { LifeBuoy, MessageSquare, PhoneCall, Mail } from "lucide-react";

export default function SupportPage() {
  const faqs = [
    { q: "Where is my order?", a: "You can track your order in real-time by going to 'My Orders' and clicking on your active order." },
    { q: "How do I cancel my order?", a: "Orders can only be cancelled before the restaurant accepts them. Go to the order details page to cancel." },
    { q: "The restaurant sent the wrong item.", a: "We apologize! Please contact our support team with a photo of the item, and we'll process a refund or replacement." },
    { q: "How long do refunds take?", a: "Refunds typically take 3-5 business days to reflect in your original payment method." },
  ];

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-16">
        
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-purple-100 dark:bg-purple-950/30 text-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-purple-500/10 rotate-3">
            <LifeBuoy className="w-10 h-10" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-white">
            How can we <span className="text-purple-500">help?</span>
          </h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Whether you have a question about an order or just want to say hi, our team is here for you 24/7.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] text-center border border-zinc-100 dark:border-zinc-800 hover:border-orange-500 transition-colors shadow-sm group">
            <MessageSquare className="w-8 h-8 mx-auto mb-4 text-orange-500 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-lg mb-2">Live Chat</h3>
            <p className="text-zinc-500 text-sm mb-4">Fastest response time.</p>
            <button className="text-orange-600 font-bold text-sm">Start Chat &rarr;</button>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] text-center border border-zinc-100 dark:border-zinc-800 hover:border-orange-500 transition-colors shadow-sm group">
            <Mail className="w-8 h-8 mx-auto mb-4 text-orange-500 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-lg mb-2">Email Us</h3>
            <p className="text-zinc-500 text-sm mb-4">Get a reply within 2 hours.</p>
            <button className="text-orange-600 font-bold text-sm">Send Email &rarr;</button>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] text-center border border-zinc-100 dark:border-zinc-800 hover:border-orange-500 transition-colors shadow-sm group">
            <PhoneCall className="w-8 h-8 mx-auto mb-4 text-orange-500 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-lg mb-2">Call Support</h3>
            <p className="text-zinc-500 text-sm mb-4">For urgent order issues.</p>
            <button className="text-orange-600 font-bold text-sm">Call Now &rarr;</button>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-zinc-100 dark:border-zinc-800">
          <h2 className="text-3xl font-black mb-8 text-zinc-900 dark:text-white">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-zinc-100 dark:border-zinc-800 pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{faq.q}</h3>
                <p className="text-zinc-500 font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
