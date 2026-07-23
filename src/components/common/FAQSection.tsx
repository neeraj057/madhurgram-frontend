"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  q: string;
  qEng: string;
  a: string;
  aEng: string;
}

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      q: "धीमी आँच (Slow-Cooked) पर बना घी सामान्य मशीनी घी से कैसे अलग है?",
      qEng: "How is Slow-Cooked Desi Ghee different from commercial machine ghee?",
      a: "व्यावसायिक मशीनी घी को हाई-हीट पर केमिकल्स या क्विक मेल्टिंग से तुरंत तैयार किया जाता है। इसके विपरीत, हमारा पारंपरिक 'धीमी आँच पर पका घी' ताज़ा शुद्ध मलाई को हल्की आँच (Slow Cooking) पर घंटों तपाकर बनाया जाता है। यह धीमी प्रक्रिया घी की प्राकृतिक सोंधी महक, दानेदार बनावट, और पोषक तत्वों को सुरक्षित रखती है।",
      aEng: "Commercial ghee is rapidly processed on high industrial heat. MadhurGram Slow-Cooked Ghee is made by gently simmering 100% pure fresh cream on a low flame for hours. This patient slow-cooking preserves the rich natural aroma, golden granular texture, and essential healthy fats."
    },
    {
      q: "क्या आपके गुड़ (Jaggery) में किसी प्रकार के रसायन या रंग का प्रयोग होता है?",
      qEng: "Do you use chemicals or colors in your Jaggery?",
      a: "बिल्कुल नहीं। बाजार में बिकने वाले हल्के पीले रंग के गुड़ को साफ करने के लिए 'हाइड्रोस' (Hydrosulfite) या अन्य रसायनों का भारी प्रयोग किया जाता है। मधुरग्राम का जैविक गुड़ (Gur) गन्ने के शुद्ध रस को लोहे के बड़े कड़ाहों में बिना किसी हानिकारक केमिकल या सल्फर के पारंपरिक रूप से उबालकर तैयार किया जाता है। इसका गहरा कत्थई रंग इसकी 100% प्राकृतिक शुद्धता की पहचान है।",
      aEng: "Absolutely not. Commercial light-yellow jaggery uses chemical clarifying agents like hydrosulfite. MadhurGram organic jaggery is made by boiling fresh sugarcane juice in traditional iron pans without sulfur or artificial clarifying chemicals. Its dark brown color is a direct indicator of its unrefined, natural purity."
    },
    {
      q: "मधुरग्राम के अचार को लंबे समय तक सुरक्षित रखने के लिए क्या इस्तेमाल होता है?",
      qEng: "What preservatives are used in MadhurGram pickles?",
      a: "हम अपने अचार में किसी भी प्रकार के कृत्रिम या रासायनिक प्रिज़र्वेटिव (जैसे सोडियम बेंजोएट) का उपयोग नहीं करते हैं। हमारे अचार को सुरक्षित रखने के लिए सदियों पुरानी दादी-नानी की विधि का पालन किया जाता है: धूप में सुखाना, शुद्ध सरसों का तेल, हल्दी, और शुद्ध नमक का संतुलित उपयोग। सरसों का तेल और नमक प्राकृतिक संरक्षक (natural preservatives) के रूप में काम करते हैं जो अचार को सालों-साल ख़राब होने से बचाते हैं।",
      aEng: "We use zero artificial chemical preservatives like sodium benzoate. Our pickles are naturally preserved using age-old traditional methods: solar-drying, and using pure cold-pressed mustard oil, turmeric, and sea salt. Mustard oil and salt act as organic, safe preservatives keeping pickles fresh for years."
    },
    {
      q: "घी और तेल को स्टोर करने का सही तरीका क्या है और इनकी शेल्फ लाइफ क्या है?",
      qEng: "What is the shelf life and correct storage method for ghee and oil?",
      a: "शुद्ध धीमी आँच पर पके देशी घी की शेल्फ लाइफ 12 महीने से अधिक होती है। इसे फ्रिज में रखने की आवश्यकता नहीं होती, बल्कि कमरे के तापमान पर सीधे धूप से दूर सूखी जगह पर रखना चाहिए। सरसों के तेल को भी आप 12 महीने तक आसानी से रख सकते हैं। ध्यान रखें कि हमेशा सूखे चम्मच का ही प्रयोग करें ताकि नमी अंदर न जाए।",
      aEng: "Pure Slow-Cooked Desi Ghee has a shelf life of over 12 months. Do not refrigerate it; store it at room temperature in a dry place away from direct sunlight. Cold-pressed oils also last up to 12 months. Always use a clean, dry spoon to prevent moisture contamination."
    },
    {
      q: "ऑर्डर करने के बाद डिलीवरी में कितना समय लगता है?",
      qEng: "How long does shipping and delivery take after placing an order?",
      a: "ऑर्डर प्राप्त होने के बाद हम ताजा बैच 24 से 48 घंटे के भीतर सीधे गोपीगंज से डिस्पैच (रवाना) कर देते हैं। भारत के मुख्य शहरों में डिलीवरी 3 से 6 कार्यदिवसों (business days) में हो जाती है। हम हर पार्सल को कांच की बोतलों में बहुत ही सुरक्षित पैकिंग के साथ भेजते हैं और डिलीवरी पर नकद (Cash on Delivery - COD) की सुविधा भी उपलब्ध है।",
      aEng: "We dispatch fresh batches directly from Gopiganj within 24-48 hours. Delivery takes 3-6 business days across India. We pack all glass containers securely to avoid breakage, and Cash on Delivery (COD) is supported."
    }
  ];

  const toggleAccordion = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="relative py-20 px-6 md:px-16 text-[#111111] overflow-hidden border-t border-gray-200/50">
      {/* Dynamic Background Circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/2 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-4xl relative z-10">
        
        {/* Section Heading */}
        <div className="mb-14 text-center">
          <span className="text-[10px] font-bold tracking-[0.35em] text-[#D4AF37] uppercase">
            Have Questions?
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-wide md:text-4xl">
            अक्सर पूछे जाने वाले सवाल
          </h2>
          <p className="mt-2 text-xs text-gray-700 font-medium tracking-wide">
            (Frequently Asked Questions)
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 select-none">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[#D4AF37] text-[10px]">✦</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
        </div>

        {/* Accordion Container */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen 
                    ? "border-[#D4AF37] bg-[#FAF3E0]/30 shadow-[0_6px_20px_rgba(212,175,55,0.04)]" 
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                {/* Header (Trigger Button) */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="flex w-full items-start justify-between p-5 text-left cursor-pointer focus:outline-none"
                >
                  <div className="flex gap-3.5 pr-4">
                    <HelpCircle className={`h-5 w-5 mt-0.5 flex-shrink-0 transition-colors duration-300 ${
                      isOpen ? "text-[#D4AF37]" : "text-gray-400"
                    }`} />
                    <div>
                      <h3 className="text-sm sm:text-base font-serif font-bold text-[#111111] leading-tight">
                        {faq.q}
                      </h3>
                      <p className="text-[10px] text-gray-400 tracking-wider font-semibold uppercase mt-1">
                        {faq.qEng}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 mt-0.5 rounded-full p-1 bg-gray-50 border border-gray-100 group-hover:bg-gray-100 transition-colors">
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-[#D4AF37]" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Body (Content) with Expand Animation */}
                <div 
                  className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                    isOpen ? "max-height-[500px] opacity-100 border-t border-gray-200/50" : "max-height-0 opacity-0"
                  }`}
                  style={{
                    maxHeight: isOpen ? "400px" : "0px"
                  }}
                >
                  <div className="p-5 sm:p-6 bg-white/40 space-y-3">
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans font-light">
                      {faq.a}
                    </p>
                    <p className="text-[11px] sm:text-xs text-gray-400 italic leading-relaxed font-light border-t border-gray-100 pt-3">
                      {faq.aEng}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
