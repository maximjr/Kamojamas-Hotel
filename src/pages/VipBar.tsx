const VipBar = () => {
  return (
    <main className="pt-24 pb-16 min-h-screen bg-oxblood text-white flex items-center justify-center">
      <div className="container mx-auto px-6 md:px-12 text-center bg-black/20 p-16 rounded-3xl backdrop-blur-md max-w-4xl border border-white/10">
        <h1 className="text-5xl font-serif text-gold mb-6 tracking-tight">VIP Bar</h1>
        <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed mb-12">
          Exclusive access to premium spirits, signature cocktails, and an atmosphere of refined elegance.
        </p>
        <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl relative border border-white/5">
            <img src="https://i.imgur.com/gsk1niS.jpeg" alt="VIP Bar" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center">
                <span className="text-gold font-serif text-3xl italic">Exclusive Experience</span>
            </div>
        </div>
      </div>
    </main>
  );
};

export default VipBar;
