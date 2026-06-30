import Card from "./Card";
import CardImage from "./CardImage";
import CardTitle from "./CardTitle";
import CardHeader from "./CardHeader";
import CardFooter from "./CardFooter";
import CardBody from "./CardBody";
import { motion } from "framer-motion";

import { MdEditSquare } from "react-icons/md";

const ProductCard = ({ produk, mode = "home", onEdit, onDelete }) => {
  const formatRupiah = (nominal) => {
    if (!nominal) return "Rp 0";
    return "Rp " + Number(nominal).toLocaleString("id-ID");
  };

  const isHome = mode === "home";
  const isOwner = mode === "owner";
  const isCashier = mode === "cashier";

  if (!produk || produk.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <h3 className={`text-xl font-bold ${isHome ? "text-white" : "text-black"}`} >
            Produk tidak ditemukan
          </h3>

          <p className={`text-sm mt-0 ${isHome ? "text-gray-200" : "text-gray-600"}`}>
            Coba gunakan kata kunci atau filter lain
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        mode === "home"
          ? "min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-8"
          : "w-full"
      }
    >
      <div
        className={
          mode === "home"
            ? "mt-0 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto"
            : "w-full"
        }
      >
        <div
          className={
            mode === "home"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          }
        >
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
                  <div className="mb-0">
                    <CardImage src={item.gambarUrl} alt={item.namaProduk} />
                  </div>
                )}
                <div className="p-4">
                  <CardHeader>
                    {item.merek && (
                      <span
                        className="inline-block px-3 py-1 border border-[#5F04E8] 
                      text-[#5F04E8] text-xs font-semibold rounded-full"
                      >
                        {item.merek?.namaMerek}
                      </span>
                    )}
                    {item.kategori && (
                      <span
                        className="inline-block px-3 py-1 border border-orange-500 text-orange-500
                        text-xs font-semibold rounded-full ml-2"
                      >
                        {item.kategori.namaKategori}
                      </span>
                    )}

                    <CardTitle className="text-[#5F04E8] leading-tight mt-1">
                      {item.namaProduk}
                    </CardTitle>

                    <CardBody
                      className={`inline-flex items-center justify-center px-2 py-0 mb-1 text-white
                      text-sm font-light rounded-md
                      ${item.stok > 5 ? "bg-[#5F04E8]" : "bg-orange-500"}`}
                    >
                      {item.stok > 5
                        ? `Tersedia ${item.stok}`
                        : `Tersisa ${item.stok}`}
                    </CardBody>
                  </CardHeader>

                  {item.deskripsi ? (
                    <CardBody className="text-[#5F04E8] text-sm leading-tight mt-0">
                      {item.deskripsi}
                    </CardBody>
                  ) : (
                    <CardBody className="text-[#5F04E8] leading-none italic">
                      Tidak ada deskripsi untuk produk ini
                    </CardBody>
                  )}

                  <CardFooter className="border-gray-300">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#5F04E8] text-lg">
                        {formatRupiah(item.hargaDefault)}
                      </span>

                      {isOwner && (
                        <button
                          onClick={() => onEdit?.(item)}
                          className="text-[#5F04E8] hover:text-orange-500 transition-colors"
                        >
                          <MdEditSquare size={28} />
                        </button>
                      )}
                    </div>

                    {isOwner && (
                      <div className="flex justify-center mt-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="sr-only peer"
                            onChange={() => onDelete?.(item.idProduk)}
                          />

                          <div
                            className="w-11 h-6 bg-red-500 rounded-full peer peer-checked:bg-green-500
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white
                            after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"
                          ></div>
                        </label>
                      </div>
                    )}

                    {isCashier && (
                      <button className="w-full mt-3 bg-orange-500 text-white py-2 rounded-md">
                        + Keranjang
                      </button>
                    )}
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
