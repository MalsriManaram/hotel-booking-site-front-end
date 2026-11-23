import HeroForm from "./HeroForm";

const Hero = () => {
  return (
    <div className="relative z-10 flex flex-col items-center text-white justify-center px-4 sm:px-8 pt-16 pb-14 md:pt-24 md:pb-20 max-w-6xl mx-auto">
      <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-amber-300 font-semibold mb-4 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-amber-300/30">
        Curated Global Hospitality
      </span>

      <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold mb-5 text-center leading-[1.08] drop-shadow-md">
        Find Your Best Staycation
      </h1>

      <p className="text-base sm:text-lg md:text-xl text-center max-w-2xl text-neutral-200 drop-shadow">
        Describe your dream destination and atmosphere, and we will match the
        finest sanctuaries tailored to your stay.
      </p>

      <HeroForm />
    </div>
  );
};

export default Hero;
