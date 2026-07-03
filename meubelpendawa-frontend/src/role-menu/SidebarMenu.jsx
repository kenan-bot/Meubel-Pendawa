import { MdSpaceDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { FaShippingFast } from "react-icons/fa";
import { MdOutlineInsights } from "react-icons/md";
import { MdShoppingCart } from "react-icons/md";
import { RiHistoryLine } from "react-icons/ri";
import { FaProductHunt } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";

export const ownerMenus = [
  {
    icon: <MdSpaceDashboard size={30} />,
    label: "Dashboard",
    path: "/owner/dashboard",
  },
  {
    icon: <FaProductHunt size={30} />,
    label: "Produk",
    path: "/owner/produk",
  },
  {
    icon: <FaUsers size={30} />,
    label: "Karyawan",
    path: "/owner/karyawan",
  },
  {
    icon: <MdCategory size={30} />,
    label: "Atribut Produk",
    path: "/owner/kategori",
  },
  {
    icon: <FaShippingFast size={30} />,
    label: "Status Pengiriman",
    path: "/owner/statuspengiriman",
  },
  {
    icon: <MdOutlineInsights size={30} />,
    label: "Laporan Penjualan",
    path: "/owner/laporanpenjualan",
  },
  {
    icon: <MdOutlineSecurity size={30} />,
    label: "Riwayat Login",
    path: "/owner/riwayatlogin",
  },
];

export const kasirMenus = [
  {
    icon: <MdShoppingCart size={30} />,
    label: "Transaksi",
    path: "/kasir/transaksi",
  },
  {
    icon: <FaShippingFast size={30} />,
    label: "Status Pengiriman",
    path: "/kasir/statuspengiriman",
  },
  {
    icon: <RiHistoryLine size={30} />,
    label: "Riwayat Harian",
    path: "/kasir/riwayatharian",
  },
];

export const driverMenus = [
  {
    icon: <FaShippingFast size={24} />,
    label: "Status Pengiriman",
    path: "/driver/statuspengiriman",
  },

];