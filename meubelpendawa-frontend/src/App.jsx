import Navbar from "./layout/Navbar";
import HeroSection from "./home/HeroSection";
import ProductSection from "./home/ProductSection";

function App() {
  return (
    <div
      style={{minHeight: "100vh", background:"#5F04E8",}} >
      <Navbar />
      <HeroSection />
      <ProductSection />
    </div>
  );
}

export default App;