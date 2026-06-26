import Navbar from "../layout/Navbar";
import HeroSection from "./HeroSection";
import ProductSection from "./ProductSection";
import ContactSection from "./ContactSection";
import { motion } from "framer-motion";

function Home () {
  return (
    <div
      style={{minHeight: "100vh", background:"#5F04E8",}} >
      <Navbar />
      <HeroSection />
      <ProductSection />
      <ContactSection />
    </div>
  );
}

export default Home;