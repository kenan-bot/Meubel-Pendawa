import Card from "../components/Card";
import CardImage from "../components/CardImage";
import CardTitle from "../components/CardTitle";
import CardHeader from "../components/CardHeader";
import CardFooter from "../components/CardFooter";
import CardBody from "../components/CardBody";
import { cardsData } from "../data-produk/cardsData";
import { motion } from "framer-motion";

const ProductCard = () => {
  return (
    <div
      className="min-h-screen bg-linear-to-br from gray-50
    to-gray-100 p-8"
    >
      <div className="mt-0 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <div
          className="grid grid-cols1 md:grid-cols-2
        lg:grid-cols-4 gap-8"
        >
          {cardsData.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{opacity: 0, y: 30, scale: 0.95,}}
              whileInView={{opacity: 1, y: 0, scale: 1,}}
              viewport={{once: false, amount: 0.2,}}
              transition={{duration: 0.5, delay: Math.min(index * 0.08, 0.5),}}
            >
              <Card padding="none">
                {card.image && <CardImage src={card.image} alt={card.title} />}
                <div className="p-6">
                  <CardHeader>
                    {card.merek && (
                      <span
                        className="inline-block px-3 py-1 border border-[#5F04E8] text-[#5F04E8]
                  text-sm font-semibold rounded-full"
                      >
                        {card.merek}
                      </span>
                    )}

                    <CardTitle className="text-[#5F04E8] leading-tight mt-3">
                      {card.title}
                    </CardTitle>

                    <CardBody
                      className={`inline-flex items-center justify-center 
                  px-3 py-0 text-white text-sm font-light rounded-md ${
                    card.stok > 5 ? "bg-[#5F04E8]" : "bg-orange-500"
                  }`}
                    >
                      {card.stok > 5
                        ? `Tersedia ${card.stok}`
                        : `Tersisa ${card.stok}`}
                    </CardBody>
                  </CardHeader>

                  {card.description ? (
                    <CardBody className="text-[#5F04E8] text-sm leading-tight">
                      {card.description}
                    </CardBody>
                  ) : (
                    <CardBody className="text-[#5F04E8] leading-none italic">
                      Tidak ada deskripsi untuk produk ini
                    </CardBody>
                  )}

                  <CardFooter className="border-gray-300">
                    <div className="flex items-center justify-between">
                      {card.price ? (
                        <span className="text-xl font-extrabold text-[#5F04E8]">
                          {card.price}
                        </span>
                      ) : (
                        <span>Hubungi kami untuk membeli</span>
                      )}
                    </div>
                  </CardFooter>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
