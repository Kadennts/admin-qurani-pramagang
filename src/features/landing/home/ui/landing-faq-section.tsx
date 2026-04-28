import { ChevronDown } from "lucide-react";

import type { useLandingHome } from "../hooks/use-landing-home";

export function LandingFaqSection({
  state,
}: {
  state: ReturnType<typeof useLandingHome>;
}) {
  const { faqSection } = state.content;

  return (
    <section className="bg-white py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-5">
          <h2 className="mb-8 text-5xl leading-tight font-black text-slate-900 lg:text-6xl">
            {faqSection.title}
          </h2>
          <div className="flex gap-2">
            <div className="h-1 w-12 rounded-full bg-purple-500" />
            <div className="h-1 w-8 rounded-full bg-purple-200" />
            <div className="h-1 w-8 rounded-full bg-purple-100" />
          </div>
        </div>

        <div className="space-y-4 lg:col-span-7">
          {faqSection.items.map((faq, index) => {
            const isOpen = state.openFaqIndex === index;

            return (
              <div
                key={faq.question}
                className={`overflow-hidden rounded-xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md ${
                  isOpen
                    ? "border-slate-300 bg-slate-50"
                    : "bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => state.toggleFaq(index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none"
                >
                  <span className="pr-8 font-bold text-slate-800">
                    {faq.question}
                  </span>
                  <div
                    className={`shrink-0 transform text-slate-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-emerald-600" : ""
                    }`}
                  >
                    <ChevronDown size={20} />
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[500px] opacity-100 pb-6" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-6 text-sm leading-relaxed text-slate-600">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
