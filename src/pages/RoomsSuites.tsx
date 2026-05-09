import Rooms from "../components/Rooms";

const RoomsSuites = () => {
  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-6 md:px-12 text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-oxblood mb-6 tracking-tight">Our Rooms & Suites</h1>
        <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Experience unparalleled luxury and comfort in our meticulously designed accommodations.
        </p>
      </div>
      <Rooms />
    </main>
  );
};

export default RoomsSuites;
