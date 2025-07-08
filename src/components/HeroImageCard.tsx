// src/components/HeroImageCard.tsx

interface HeroImageCardProps {
  imageUrl: string;
}

const HeroImageCard = ({ imageUrl }: HeroImageCardProps) => {
  return (
    <div className="w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
      <img
        src={imageUrl}
        alt="Hero Background Image"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default HeroImageCard;