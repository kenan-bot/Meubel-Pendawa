import React from "react";
import Card from "../components/Card";
import CardImage from "../components/CardImage";

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
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
