import Card from "../components/Card";
import CardImage from "../components/CardImage";
import CardTitle from "../components/CardTitle";
import CardHeader from "../components/CardHeader";
import CardFooter from "../components/CardFooter";
import CardBody from "../components/CardBody";
import {cardsData} from "../data-produk/cardsData";

const ProductCard = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from gray-50
    to-gray-100 p-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols1 md:grid-cols-2
        lg:grid-cols-3 gap-8"
        >
          {cardsData.map((card) => (
            <Card
            key={card.id}
            variant={card.id % 2 === 0 ? "primary" : "default"}
            padding="none"
           >
            {card.image && <CardImage src={card.image} alt={card.title} />}
            <div className="p-6">
              <CardHeader>
                {card.category && <span className="inline-block px-3 py-1
                bg-blue-100 text-blue-700 text-sm font-semibold
                rounded-full mb-2">
                  {card.category}</span>}
              </CardHeader>
            </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
