import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import { useTransaksi } from "../context/TransaksiContext";

// Override ukuran default FormInput/FormSelect (px-3 py-2, text normal) jadi lebih compact,
// dengan teknik arbitrary-selector yang sama seperti dipakai di RupiahInput.
const compact = "[&_label]:text-[11px] [&_label]:mb-0.5 [&_input]:px-2 [&_input]:py-1.5 [&_input]:text-xs [&_select]:px-2 [&_select]:py-1.5 [&_select]:text-xs";

const FormPemesan = () => {
  const {
    namaPemesan, setNamaPemesan, noWhatsapp, setNoWhatsapp,
    metodePengiriman, setMetodePengiriman, metodePembayaran, setMetodePembayaran,
    alamatPengiriman, setAlamatPengiriman, driverId, setDriverId, driverList,
  } = useTransaksi();
  const isDelivery = metodePengiriman === "DELIVERY";

  return (
    <div className={compact}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
        <FormInput label="Nama" value={namaPemesan} onChange={(e) => setNamaPemesan(e.target.value)}
          placeholder="Nama Pemesan" required />
        <FormInput label="No. Telp/WhatsApp" value={noWhatsapp} onChange={(e) => setNoWhatsapp(e.target.value)}
          placeholder="085XXXXXXXXX" required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
        <FormSelect label="Pengiriman" value={metodePengiriman} onChange={(e) => setMetodePengiriman(e.target.value)}>
          <option value="DELIVERY">Delivery</option>
          <option value="PICKUP">Pickup</option>
        </FormSelect>
        <FormSelect label="Pembayaran" value={metodePembayaran} onChange={(e) => setMetodePembayaran(e.target.value)}>
          <option value="CASH">Cash</option>
          <option value="CASHLESS">Cashless</option>
        </FormSelect>
      </div>

      {isDelivery && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <FormInput label="Alamat Lengkap" value={alamatPengiriman} onChange={(e) => setAlamatPengiriman(e.target.value)}
            placeholder="Jl. Pendawa No. 3, Lodoyong, Kec. Ambarawa" required />
          <FormSelect label="Driver" value={driverId} onChange={(e) => setDriverId(e.target.value)}>
            {driverList.map((d) => (
              <option key={d.idKaryawan} value={d.idKaryawan}>{d.namaKaryawan}</option>
            ))}
          </FormSelect>
        </div>
      )}
    </div>
  );
};

export default FormPemesan;