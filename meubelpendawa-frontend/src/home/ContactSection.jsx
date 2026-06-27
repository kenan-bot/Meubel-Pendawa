import AnimatedSection from "../components/AnimatedSection";
import { MapPin, MessageCircle, Clock } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="scroll-mt-32">
      {/* Bagian Ungu - Teks Ajakan */}
      <AnimatedSection>
        <div className="bg-[#5F04E8] py-16 px-4 text-center">
          <h2 className="text-white text-3xl md:text-4xl font-bold">
            Contact us anytime for{" "}
            <span className="text-[#FF6B00]">questions</span> or{" "}
            <span className="text-[#FF6B00]">orders.</span>
          </h2>
          <p className="text-white text-lg md:text-xl mt-3 opacity-90">
            We're here to help with fast and friendly service.
          </p>
        </div>
      </AnimatedSection>

      {/* Bagian Orange - Kartu Kontak */}
      <AnimatedSection>
        <div className="bg-[#FF6B00] py-14 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Kartu Lokasi */}
            <div className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-md">
              <div className="bg-[#FF6B00] rounded-full w-14 h-14 flex items-center justify-center flex-shrink-0">
                <MapPin className="text-white w-7 h-7" />
              </div>
              <div>
                <h3 className="text-[#5F04E8] text-xl font-bold mb-1">
                  Location
                </h3>
                <p className="text-[#FF6B00] text-sm leading-snug">
                  Jl. Brigjend Sudiarto, Pandean, Lodoyong,
                  <br />
                  Kec. Ambarawa, Kabupaten Semarang,
                  <br />
                  Jawa Tengah 50611
                </p>
              </div>
            </div>

            {/* Kartu WhatsApp */}
            <div className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-md">
              <div className="bg-[#FF6B00] rounded-full w-14 h-14 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="text-white w-7 h-7" />
              </div>
              <div>
                <h3 className="text-[#5F04E8] text-xl font-bold mb-1">
                  WhatsApp
                </h3>
                <a
                  href="https://wa.me/6283681912"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF6B00] font-semibold text-base hover:underline"
                >
                  0836 – 8191 – 192
                </a>
              </div>
            </div>

            {/* Kartu Jam Operasional */}
            <div className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-md">
              <div className="bg-[#FF6B00] rounded-full w-14 h-14 flex items-center justify-center flex-shrink-0">
                <Clock className="text-white w-7 h-7" />
              </div>
              <div>
                <h3 className="text-[#5F04E8] text-xl font-bold mb-1">
                  Operasional
                </h3>
                <p className="text-[#FF6B00] font-semibold text-base">
                  08.00 – 18.00 WIB
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
};

export default ContactSection;
