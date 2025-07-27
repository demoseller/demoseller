// src/components/HeroImageCard.tsx

interface HeroImageCardProps {
  imageUrl: string;
}

const HeroImageCard = ({ imageUrl }: HeroImageCardProps) => {
  return (
    <div className="relative p-[3px]">
      {/* Gradient border wrapper */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-primary dark:bg-gradient-primary-dark"></div>
      
      {/* Card content */}
      <div className="w-full h-56 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl relative z-10 bg-background">
        <img
          src={imageUrl}
          alt="Hero Background Image"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default HeroImageCard;