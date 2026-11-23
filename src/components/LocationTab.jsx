const LocationTab = ({ selectedLocation, name, onClick }) => {
  const isSelected = selectedLocation === name;

  return (
    <button
      type="button"
      onClick={() => onClick(name)}
      className={`text-sm rounded-full px-4 py-1.5 font-medium border transition-all cursor-pointer ${
        isSelected
          ? "bg-neutral-950 text-amber-300 border-neutral-950 shadow-sm"
          : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400 hover:text-neutral-950"
      }`}
    >
      {name}
    </button>
  );
};

export default LocationTab;
