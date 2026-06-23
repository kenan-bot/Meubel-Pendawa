import Navbar from "./layout/Navbar";
import HeroSection from "./home/HeroSection";
import ProductCard from "./home/ProductCard";

function App() {
  return (
    <div
      style={{minHeight: "100vh", background:"#5F04E8",}} >
      <Navbar />
      <HeroSection />
      <ProductCard />
    </div>
  );
}

export default App;