import { useState } from 'react';

// Example book data with content
const allBooks = [
  { id: 1, title: 'The Whimsical Woods', author: 'A. Fairy', content: 'Once upon a time in the Whimsical Woods...', cover: '/covers/woods.jpg' },
  { id: 2, title: 'Rainbow Adventures', author: 'B. Unicorn', content: 'Join the Rainbow Adventures and discover magic...', cover: '/covers/rainbow.jpg' },
  { id: 3, title: 'Starlit Dreams', author: 'C. Dreamer', content: 'Starlit Dreams take you to the stars...', cover: '/covers/starlit.jpg' },
  { id: 4, title: 'Mystic Mountains', author: 'D. Wanderer', content: 'Climb the Mystic Mountains and find wonder...', cover: '/covers/mountains.jpg' },
];

export default function Dashboard() {
  // Simulate books read by user and progress
  const [readBooks, setReadBooks] = useState<{[id: number]: number}>({ 1: 100 }); // bookId: percentRead
  const [selectedBook, setSelectedBook] = useState<number | null>(null);

  const handleRead = (id: number) => {
    if (!readBooks[id]) setReadBooks({ ...readBooks, [id]: 10 }); // Start at 10%
    setSelectedBook(id);
  };

  const handleProgress = (id: number, value: number) => {
    setReadBooks({ ...readBooks, [id]: value });
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-blue-400 to-yellow-400 animate-gradient">📚 My Whimsical Library</h1>
      <div className="flex overflow-x-auto gap-8 max-w-6xl mx-auto pb-8">
        {allBooks.map(book => (
          <div
            key={book.id}
            className={`relative card bg-white/80 shadow-xl border-4 rounded-3xl p-6 flex flex-col items-center min-w-[260px] max-w-xs transition-transform duration-300 hover:scale-105 ${readBooks[book.id] ? 'border-blue-300' : 'border-pink-200'}`}
          >
            <div className="w-32 h-44 bg-gradient-to-br from-pink-200 via-blue-200 to-yellow-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
              <span className="text-6xl">📖</span>
            </div>
            <h2
              className="text-xl font-bold mb-1 text-blue-500 underline cursor-pointer hover:text-blue-700 transition-colors"
              onClick={() => handleRead(book.id)}
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleRead(book.id); }}
              role="button"
              aria-label={`Open ${book.title}`}
            >
              {book.title}
            </h2>
            <p className="text-pink-400 mb-2">by {book.author}</p>
            <div className="w-full mt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-blue-500">Progress</span>
                <span className="text-blue-700 font-bold">{readBooks[book.id] || 0}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={readBooks[book.id] || 0}
                onChange={e => handleProgress(book.id, Number(e.target.value))}
                className="w-full accent-blue-400"
              />
              <div className="h-2 w-full bg-blue-100 rounded-full mt-1">
                <div
                  className="h-2 bg-blue-400 rounded-full transition-all duration-300"
                  style={{ width: `${readBooks[book.id] || 0}%` }}
                />
              </div>
            </div>
            {readBooks[book.id] ? (
              <span className="px-3 py-1 bg-blue-200 text-blue-700 rounded-full text-xs font-semibold mt-2 animate-float">Reading</span>
            ) : (
              <span className="px-3 py-1 bg-pink-200 text-pink-700 rounded-full text-xs font-semibold mt-2 animate-bounce">Click the title to Read</span>
            )}
          </div>
        ))}
      </div>
      {selectedBook && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-xl text-gray-400 hover:text-gray-700"
              onClick={() => setSelectedBook(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-2 text-blue-600">{allBooks.find(b => b.id === selectedBook)?.title}</h2>
            <p className="mb-4 text-pink-500">by {allBooks.find(b => b.id === selectedBook)?.author}</p>
            <div className="mb-4 text-gray-700 whitespace-pre-line">
              {allBooks.find(b => b.id === selectedBook)?.content}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-500">Progress</span>
              <input
                type="range"
                min={0}
                max={100}
                value={readBooks[selectedBook] || 0}
                onChange={e => handleProgress(selectedBook, Number(e.target.value))}
                className="w-full accent-blue-400"
              />
              <span className="text-xs text-blue-700 font-bold">{readBooks[selectedBook] || 0}%</span>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-bounce { animation: bounce 1s infinite alternate; }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.5s; }
      `}</style>
    </div>
  );
}
