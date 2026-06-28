import Card from "../components/Card";
import CardImage from "../components/CardImage";
import CardTitle from "../components/CardTitle";
import CardHeader from "../components/CardHeader";
import CardFooter from "../components/CardFooter";
import CardBody from "../components/CardBody";
import { motion } from "framer-motion";

const ProductCard = ({ produk }) => {
  const formatRupiah = (nominal) => {
    if (!nominal) return "Rp 0";
    return "Rp " + Number(nominal).toLocaleString("id-ID");
  };
  return (
    <div className="min-h-screen bg-linear-to-br from gray-50 to-gray-100 p-8">
      <div className="mt-0 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {produk.map((item, index) => (
            <motion.div
              key={item.idProduk}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.5) }}
            >
              <Card padding="none">
                {" "}
                {item.gambarUrl && (
                  <CardImage src={item.gambarUrl} alt={item.namaProduk} />
                )}
                <div className="p-6">
                  <CardHeader>
                    {item.merek && (
                      <span
                        className="inline-block px-3 py-1 border border-[#5F04E8] 
                      text-[#5F04E8] text-sm font-semibold rounded-full"
                      >
                        {item.merek?.namaMerek}
                      </span>
                    )}
                    {item.kategori && (
                      <span
                        className="inline-block px-3 py-1 border border-orange-500 text-orange-500
                        text-sm font-semibold rounded-full ml-2"
                      >
                        {item.kategori.namaKategori}
                      </span>
                    )}

                    <CardTitle className="text-[#5F04E8] leading-tight mt-3">
                      {item.namaProduk}
                    </CardTitle>

                    <CardBody
                      className={`inline-flex items-center justify-center px-3 py-0 text-white
                      text-sm font-light rounded-md
                      ${item.stok > 5 ? "bg-[#5F04E8]" : "bg-orange-500"}`}
                    >
                      {item.stok > 5
                        ? `Tersedia ${item.stok}`
                        : `Tersisa ${item.stok}`}
                    </CardBody>
                  </CardHeader>

                  {item.deskripsi ? (
                    <CardBody className="text-[#5F04E8] text-sm leading-tight">
                      {item.deskripsi}
                    </CardBody>
                  ) : (
                    <CardBody className="text-[#5F04E8] leading-none italic">
                      Tidak ada deskripsi untuk produk ini
                    </CardBody>
                  )}

                  <CardFooter className="border-gray-300">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-extrabold text-[#5F04E8]">
                        {formatRupiah(item.hargaDefault)}
                      </span>
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
