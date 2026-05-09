const Restaurant = () => {
  return (
    <main className="pt-24 pb-16 min-h-screen bg-paper flex items-center justify-center">
      <div className="container mx-auto px-6 md:px-12 text-center bg-white p-16 rounded-3xl shadow-xl max-w-4xl">
        <h1 className="text-5xl font-serif text-oxblood mb-6 tracking-tight">Our Restaurant</h1>
        <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed mb-12">
          Discover a culinary journey crafted by world-renowned chefs, featuring locally sourced ingredients and exquisite flavors.
        </p>
        <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden shadow-lg relative">
            <img src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1200" alt="Restaurant" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-oxblood/20 flex flex-col items-center justify-center">
                <span className="text-white font-serif text-3xl italic">Coming Soon</span>
            </div>
        </div>
      </div>
    </main>
  );
};

export default Restaurant;
