import Filter from '@/components/Filter';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1E201E] flex-column items-center justify-center p-8">
      
      {/* Search Bar */}
      <div className="w-full max-w-2xl relative">
        
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg className="w-6 h-6 text-[#697565]"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input Field */}
        <input className="w-full py-4 pl-12 pr-4 text-lg text-[#ECDFCC] bg-[#3C3D37] rounded-full focus:outline-none focus:ring-2 focus:ring-[#697565] placeholder-[#697565] shadow-lg transition-all"
          type="text" 
          placeholder="Search for a movie..." 
        />

        {/* Optional: 'Search' Button inside the bar */}
        <button className="absolute inset-y-2 right-2 bg-[#ECDFCC] text-[#1E201E] px-6 rounded-full font-semibold hover:bg-white transition-colors">
          Search
        </button>

      </div>

      {/* Filter Button*/}
      <Filter />

    </main>
  );
}
