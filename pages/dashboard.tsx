import { useState } from 'react';

// Example book data
const allBooks = [
  { id: 1, title: 'The Whimsical Woods', author: 'A. Fairy', cover: '/covers/woods.jpg' },
  { id: 2, title: 'Rainbow Adventures', author: 'B. Unicorn', cover: '/covers/rainbow.jpg' },
  { id: 3, title: 'Starlit Dreams', author: 'C. Dreamer', cover: '/covers/starlit.jpg' },
  { id: 4, title: 'Mystic Mountains', author: 'D. Wanderer', cover: '/covers/mountains.jpg' },
];

export default function Dashboard() {
  // Simulate books read by user
  const [readBooks, setReadBooks] = useState([1]);

  const handleRead = (id: number) => {
    if (!readBooks.includes(id)) setReadBooks([...readBooks, id]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-50 p-8">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-blue-400 to-yellow-400 animate-gradient">📚 My Whimsical Library</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {allBooks.map(book => (
          <div key={book.id} className={`relative card bg-white/80 shadow-xl border-4 rounded-3xl p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 ${readBooks.includes(book.id) ? 'border-blue-300' : 'border-pink-200'}`}> 
            <div className="w-32 h-44 bg-gradient-to-br from-pink-200 via-blue-200 to-yellow-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
              {/* Placeholder for book cover */}
              <span className="text-6xl">📖</span>
            </div>
            <h2 className="text-xl font-bold mb-1 text-blue-500">{book.title}</h2>
            <p className="text-pink-400 mb-2">by {book.author}</p>
            {readBooks.includes(book.id) ? (
              <span className="px-3 py-1 bg-blue-200 text-blue-700 rounded-full text-xs font-semibold mb-2 animate-float">Read</span>
            ) : (
              <button
                className="btn btn-primary bg-gradient-to-r from-pink-400 via-blue-400 to-yellow-400 text-white font-bold shadow-lg hover:scale-105 transition-transform duration-300 animate-bounce"
                onClick={() => handleRead(book.id)}
              >
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>
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
      `}</style>
    </div>
  );
}
