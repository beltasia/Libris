import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '@/services/firebase';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  UserTrialData, 
  getUserTrialData, 
  updateLastLogin, 
  checkAndUpdateTrialStatus,
  createUserTrialData,
  isUserAdmin
} from '@/utils/trial';
import TrialStatus from '@/components/TrialStatus';

interface Book {
  id: string;
  title: string;
  author: string;
  cover?: string;
  description?: string;
  publishYear?: number;
  pageCount?: number;
  isbn?: string;
}

interface UserBook extends Book {
  progress: number;
  dateStarted?: string;
  dateFinished?: string;
  content?: string;
}

interface BookWithContent extends Book {
  content: string;
  chapters?: { title: string; content: string }[];
}

// Sample story content for books
const sampleStories = {
  'user-1': `Chapter 1: The Enchanted Garden

In a small village nestled between rolling hills and whispering woods, there lived a young girl named Luna who possessed an extraordinary gift. She could hear the songs of flowers and understand the whispered secrets of trees.

Every morning, Luna would venture into her grandmother's garden, where roses hummed lullabies and sunflowers shared stories of distant lands they'd seen from their towering heights. The garden was alive with magic that only Luna could perceive.

One particular autumn day, as golden leaves danced in the crisp air, Luna discovered something remarkable. Hidden beneath the old oak tree was a shimmering portal, no larger than a dewdrop, that pulsed with gentle light.

"Where does it lead?" Luna whispered to the oak.

"To the realm where all stories are born," the ancient tree replied, its voice like rustling leaves. "But only those pure of heart may enter."

Luna's eyes sparkled with wonder. She had always dreamed of such adventures, of places where imagination knew no bounds. Taking a deep breath, she reached out her hand toward the glowing portal.

The moment her fingers touched the light, the world around her began to shift and swirl. Colors became more vibrant, sounds more melodious, and the very air seemed to shimmer with possibility.

Chapter 2: The Story Realm

Luna found herself standing in a vast library unlike any she had ever seen. Books floated through the air like gentle birds, their pages fluttering with words that glowed like stars. The shelves stretched impossibly high, reaching toward a ceiling that seemed to be made of pure starlight.

"Welcome, young storyteller," came a warm voice.

Luna turned to see a kindly woman with silver hair that sparkled like moonbeams. Her robes were adorned with words that moved and changed, telling different stories as they danced across the fabric.

"I am Aria, the Keeper of Stories," the woman said with a gentle smile. "I have been waiting for you."

"Waiting for me?" Luna asked, still in awe of her surroundings.

"Yes, dear child. You have the gift of bringing stories to life, of nurturing them with your pure heart and boundless imagination. The garden taught you well."

Aria led Luna through the floating library, where books whispered their tales to anyone willing to listen. There were stories of brave knights and clever princesses, of talking animals and magical kingdoms, of friendship and courage and love.

"But something is wrong," Aria continued, her expression growing concerned. "The stories are beginning to fade. Without someone to truly believe in them, to give them life through telling and retelling, they slowly disappear."

Luna felt a pang in her heart. She couldn't bear the thought of beautiful stories disappearing forever.

"What can I do to help?" she asked eagerly.

"You must choose three stories that speak to your heart," Aria explained. "Take them back to your world and share them with others. Help people remember the magic of storytelling."

Chapter 3: The Chosen Tales

Luna wandered through the library, listening to the whispered fragments of countless stories. Finally, three books glowed brighter than the rest, calling out to her.

The first was a tale of a lonely dragon who learned that friendship was more valuable than any treasure. The second told of a village where kindness was the most powerful magic. The third was about a young inventor whose imagination helped save her community from a terrible drought.

As Luna held the three books, they merged into her heart, becoming part of her very being. She felt their warmth spreading through her, filling her with the power to bring these stories to life.

"Remember," Aria said as the portal began to appear again, "stories live through the telling. Share them freely, and they will grow stronger with each person who hears them."

Luna nodded, clutching the invisible books to her chest. As she stepped back through the portal, she knew her life had changed forever.

Epilogue: The Storyteller's Gift

Back in her grandmother's garden, Luna looked around with new eyes. The flowers still sang their songs, but now she understood that she was meant to be a bridge between the world of stories and the world of people.

That evening, as her family gathered for dinner, Luna began to tell the first of her chosen tales. Her grandmother's eyes sparkled with recognition of the old magic, while her parents and siblings listened with growing wonder.

From that day forward, Luna became known throughout the village as the greatest storyteller anyone had ever heard. Children would gather around her in the garden, adults would pause their work to listen, and even the oldest villagers would smile as they remembered the joy of a well-told tale.

And in the realm beyond the portal, Aria smiled as she watched the stories grow stronger, nourished by Luna's gift and the belief of all who heard them. The library glowed brighter than ever, filled with new tales born from the hearts of those who dared to dream.

The End.`,
  
  'user-2': `Chapter 1: The Melody of Memories

Sarah had always believed that music held magic, but she never expected to discover just how true that was until the day she inherited her great-aunt Clara's old piano.

The instrument sat in the corner of the dusty attic, covered by a faded velvet cloth. When Sarah lifted the cover, the keys seemed to shimmer in the afternoon sunlight streaming through the small window.

"It's beautiful," she whispered, running her fingers along the smooth ivory keys.

The moment she pressed the first key, something extraordinary happened. The note didn't just sound—it painted a picture in the air, a swirl of golden light that formed the image of a young woman dancing.

Startled, Sarah pulled her hand back, but the image remained for a moment before fading away. With trembling fingers, she tried again, this time playing a simple melody she remembered from childhood.

As the notes filled the attic, the air around the piano began to shimmer and dance. Images appeared—scenes from long ago, people she didn't recognize but somehow felt connected to. They were memories, she realized, memories trapped within the music itself.

Chapter 2: The Piano's Secret

That night, Sarah couldn't sleep. She kept thinking about the piano and the mysterious images it had shown her. Finally, unable to resist, she crept up to the attic with a flashlight.

In the darkness, the piano seemed even more magical. Sarah sat on the worn bench and began to play, this time with more confidence. The melodies flowed from her fingers as if they had been waiting years to be released.

With each song, new memories appeared. She saw her great-aunt Clara as a young woman, playing this very piano at elegant parties. She witnessed Clara's wedding day, her joy radiating through the music. She saw Clara teaching piano to children, their faces bright with wonder and delight.

But there were sadder memories too—Clara playing alone after her husband passed away, pouring her grief into the keys. Sarah felt tears on her cheeks as she experienced the depth of emotion trapped within the instrument.

"The piano remembers everything," came a gentle voice.

Sarah looked up to see the translucent figure of an elderly woman standing beside the piano. Though she had never met her great-aunt Clara, she knew instantly who this was.

"Aunt Clara?" Sarah whispered.

The ghostly figure smiled warmly. "Hello, dear. I've been waiting for someone in the family to find the piano's gift."

"What is this place? How are you here?"

"Music is memory, Sarah. Every song we play with genuine emotion leaves an imprint. This piano has collected a century of memories, and I've been its guardian, waiting for the right person to inherit its magic."

Chapter 3: The Gift of Music

Clara's spirit began to teach Sarah about the piano's true power. It wasn't just about seeing memories—it was about healing them. Unresolved grief, lost love, forgotten joy—all of these emotions could be processed and released through music.

"But why me?" Sarah asked as she learned to navigate the piano's magical properties.

"Because you have the gift of empathy," Clara explained. "You feel others' pain as your own, and you have the ability to transform that pain into something beautiful."

Over the following weeks, Sarah discovered that she could help people by playing their memories on the piano. Her neighbor Mrs. Henderson found peace with her late husband after Sarah played their wedding song. The local baker was able to forgive his estranged brother after hearing a lullaby from their childhood.

Word spread quietly through the town about Sarah's unusual gift. People came to her attic, bringing their sorrows and their hopes. Sarah would listen to their stories, then sit at Clara's piano and play melodies that somehow knew exactly what each person needed to hear.

Chapter 4: The Concert of Hearts

As autumn turned to winter, Sarah realized that the piano's magic was growing stronger. The memories were becoming more vivid, the healing more profound. Clara's spirit was growing brighter too, as if each person helped was giving her peace.

"There's one last thing I need you to do," Clara told Sarah one snowy evening. "The town is hurting. People have forgotten how to connect with each other, how to share their joys and sorrows. They need to remember the magic of coming together."

Sarah understood. She organized a community concert in the old town hall, bringing Clara's piano down from the attic for the first time in decades. She didn't advertise it as anything magical—just a evening of music and sharing.

But when the evening came, something wonderful happened. As Sarah played, the entire room filled with golden light. Everyone could see the memories now—their own and their neighbors'. They saw each other's struggles and triumphs, their fears and dreams.

Tears flowed freely as the community realized how much they had in common, how deeply connected they all were. Old feuds were forgiven, new friendships were born, and the town remembered what it meant to be a true community.

Epilogue: The Legacy Continues

As the concert ended and the last notes faded away, Clara's spirit appeared one final time. She was glowing with peace and contentment.

"Thank you, Sarah," she whispered. "You've given my memories the most beautiful ending I could have asked for."

With a gentle smile, Clara faded away, finally at rest.

Sarah kept the piano, continuing to use its gift to help others. But now she also began teaching children to play, passing on not just musical skills but the understanding that music could heal hearts and bring people together.

The piano's magic lived on, creating new memories with each song, each life it touched, each heart it helped to heal. And in the warm glow of the music room, surrounded by students and friends, Sarah knew that some gifts were meant to be shared with the world.

The End.`,
  
  'user-3': `Chapter 1: The Time Keeper's Apprentice

In the heart of the old city, tucked between a bakery and a bookshop, stood a peculiar clock repair shop that most people never seemed to notice. The sign above the door read "Chronos & Co. - Time Fixed While You Wait," but those who did venture inside discovered that Mr. Chronos fixed much more than ordinary timepieces.

Eleven-year-old Max stumbled upon the shop quite by accident on a rainy Tuesday afternoon. He had been running from the school bullies when he ducked into the first open door he found.

"Welcome, young man," came a warm voice from behind a mountain of ticking clocks. "I've been expecting you."

Max blinked in surprise as an elderly man with wild silver hair and twinkling eyes emerged from the chaos of gears and springs. His clothes seemed to shimmer slightly, as if they were woven from stardust.

"Expecting me? But I've never been here before," Max stammered.

"Ah, but time is funny that way," Mr. Chronos said with a mysterious smile. "Sometimes it brings us exactly where we need to be, exactly when we need to be there."

As Max looked around the shop, he noticed that none of the clocks showed the same time. Some ran backwards, others moved so slowly he could barely see the hands move, and a few seemed to be ticking in rhythm with his heartbeat.

"This is impossible," Max whispered.

"Only if you believe in impossibility," Mr. Chronos replied. "Tell me, child, what do you think time really is?"

Chapter 2: Lessons in Time

Over the following weeks, Max found himself returning to the shop every day after school. Mr. Chronos taught him that time wasn't just about minutes and hours—it was about moments, memories, and the spaces in between heartbeats where magic lived.

"You see, Max," the old man explained as he worked on a particularly stubborn pocket watch, "most people think time moves in a straight line. But really, it's more like a web, with threads connecting every moment that ever was or ever will be."

Max learned to repair not just mechanical clocks, but temporal anomalies—moments that had gotten stuck, memories that played on repeat, futures that had gotten tangled with the past. Each repair taught him something new about the nature of time and his own growing abilities.

One day, while working on a grandfather clock that only chimed for people who were about to make important decisions, Max discovered he could see the threads Mr. Chronos had described. Golden strands stretched out from every person, every object, every moment, connecting everything in an intricate web of cause and effect.

"You're a natural," Mr. Chronos said proudly. "I knew you were the one who would take over the shop when I retire."

"Retire? But you're not that old," Max protested.

Mr. Chronos chuckled. "My dear boy, I'm older than time itself. But that's a story for another day."

Chapter 3: The Great Unraveling

Max's peaceful apprenticeship was shattered when something began going wrong with time itself. People started aging backwards, events happened before their causes, and worst of all, important moments in history began disappearing entirely.

"It's the Void," Mr. Chronos explained grimly as they watched a clock melt like candle wax. "Something is eating away at the fabric of time itself. If we don't stop it, all of existence could unravel."

Max felt a chill of fear. "What can we do?"

"We need to find the source and repair it, just like any other temporal damage. But this is bigger than anything I've faced before. I'll need your help, Max. Your young eyes might see something I'm missing."

Together, they ventured into the time streams—the flowing currents of cause and effect that connected all moments. It was like swimming through liquid light, with past, present, and future swirling around them in beautiful, terrifying chaos.

At the heart of the streams, they found the source of the problem: a massive tear in reality itself, growing larger by the moment. But what shocked Max was what he saw at the center of the tear—a younger version of Mr. Chronos, trapped and calling for help.

"That's impossible," the older Chronos whispered. "That's me from a thousand years ago, when I first became the Time Keeper. But that moment was supposed to be fixed in place, unchangeable."

Chapter 4: The Loop Paradox

As Max stared at the trapped younger Chronos, he began to understand. "It's a loop," he realized. "You became the Time Keeper because your future self taught your past self how to do it. But if that moment gets erased, you never become the Time Keeper, which means you never go back to teach yourself, which means..."

"The paradox destroys everything," the older Chronos finished. "Clever boy. But how do we fix it?"

Max studied the golden threads of time, seeing how they all led to and from this central moment. Then he had an idea—terrifying, but perhaps their only hope.

"I have to take your place," he said quietly.

"What? Max, no. You're just a child. The responsibility of being Time Keeper is enormous."

"But don't you see? If I go back and teach your younger self, then the loop continues, but it starts with me instead of being broken. I've learned everything you taught me. I can do this."

Chronos looked at Max with a mixture of pride and sadness. "You understand what this means? You'll be trapped in the loop, living the same cycle over and over, always ensuring that time continues to flow properly."

Max nodded, his young face filled with determination. "Some loops are worth preserving."

Chapter 5: The New Time Keeper

With a deep breath, Max stepped into the time stream and allowed himself to be pulled back to the moment of the original paradox. He found the young Chronos—barely older than Max himself—confused and frightened by his sudden ability to see time's true nature.

"Don't be afraid," Max told him gently. "I'm here to teach you about time, about your destiny as its keeper."

As Max shared everything he had learned, he watched the tear in reality begin to heal. The time streams flowed smoothly once again, and existence stabilized. The young Chronos nodded with understanding, accepting his role.

"But who are you?" the young man asked.

"A friend," Max replied. "And someday, when you're old and wise, you'll find a young apprentice named Max. Teach him well, because he'll be the one to save time itself."

Epilogue: The Eternal Cycle

Max found himself back in the clock shop, but everything was different now. He was older, wiser, with the weight of cosmic responsibility on his shoulders. The shop was his now, and he understood that he would spend eternity ensuring that time flowed as it should.

But it wasn't a lonely existence. Each day brought new challenges, new puzzles to solve, new moments to preserve. And always, in the back of his mind, he looked forward to the day when a frightened young boy would stumble into his shop, running from bullies on a rainy Tuesday afternoon.

When that day came, Max smiled and said, "Welcome, young man. I've been expecting you."

And the cycle began again, as it always had and always would, keeping time itself safe for all eternity.

The End.`
};

// Example user's read books data with story content
const userReadBooks: UserBook[] = [
  {
    id: 'user-1',
    title: 'The Enchanted Garden',
    author: 'Luna Brightstone',
    progress: 100,
    cover: 'https://covers.openlibrary.org/b/isbn/9780743273565-M.jpg',
    description: 'A magical tale of a young girl who discovers a portal to the realm where all stories are born.',
    dateFinished: '2024-01-15',
    content: sampleStories['user-1']
  },
  {
    id: 'user-2', 
    title: 'The Piano of Memories',
    author: 'Sarah Harmonious',
    progress: 75,
    cover: 'https://covers.openlibrary.org/b/isbn/9780446310789-M.jpg',
    description: 'A heartwarming story about a magical piano that holds the memories and emotions of everyone who has ever played it.',
    dateStarted: '2024-01-20',
    content: sampleStories['user-2']
  },
  {
    id: 'user-3',
    title: 'The Time Keeper\'s Apprentice',
    author: 'Max Chronos',
    progress: 50,
    cover: 'https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg',
    description: 'An adventure through time itself, where a young boy learns to repair the very fabric of reality.',
    dateStarted: '2024-02-01',
    content: sampleStories['user-3']
  }
];

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [readBooks, setReadBooks] = useState<UserBook[]>(userReadBooks);
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<UserBook | Book | null>(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [readingMode, setReadingMode] = useState(false);
  const [currentReading, setCurrentReading] = useState<UserBook | null>(null);
  const [fontSize, setFontSize] = useState(16);
  const [darkMode, setDarkMode] = useState(false);
  const [writingMode, setWritingMode] = useState(false);
  const [userStories, setUserStories] = useState<UserBook[]>([]);
  const [currentStory, setCurrentStory] = useState<{
    title: string;
    author: string;
    content: string;
    description: string;
  }>({
    title: '',
    author: user?.email?.split('@')[0] || 'Anonymous',
    content: '',
    description: ''
  });
  const [isEditingExistingStory, setIsEditingExistingStory] = useState(false);
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [trialData, setTrialData] = useState<UserTrialData | null>(null);
  const [isLoadingTrial, setIsLoadingTrial] = useState(true);
  const [isAccessRestricted, setIsAccessRestricted] = useState(false);

  // Fetch trial data and book recommendations on component mount
  useEffect(() => {
    fetchRecommendations();
  }, []);

  // Handle trial management
  useEffect(() => {
    const handleTrialManagement = async () => {
      if (!user) return;
      
      try {
        setIsLoadingTrial(true);
        
        // Get or create trial data
        let userData = await getUserTrialData(user.uid);
        if (!userData) {
          // Create trial data for existing users who don't have it
          userData = await createUserTrialData(user);
        }
        
        // Update last login
        await updateLastLogin(user.uid);
        
        // Check and update trial status
        const updatedTrialData = await checkAndUpdateTrialStatus(userData);
        setTrialData(updatedTrialData);
        
        // Check access restrictions
        const hasAccess = updatedTrialData.trialStatus === 'active' || 
                         updatedTrialData.trialStatus === 'approved' ||
                         isUserAdmin(user.email || '');
                         
        setIsAccessRestricted(!hasAccess);
        
      } catch (error) {
        console.error('Error managing trial:', error);
        // In case of error, allow access to prevent lockout
        setIsAccessRestricted(false);
      } finally {
        setIsLoadingTrial(false);
      }
    };
    
    handleTrialManagement();
  }, [user]);

  const fetchRecommendations = async () => {
    try {
      setIsLoadingRecommendations(true);
      // Using Open Library API for book recommendations
      const subjects = ['fiction', 'mystery', 'romance', 'science-fiction', 'fantasy'];
      const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
      
      const response = await fetch(`https://openlibrary.org/subjects/${randomSubject}.json?limit=12`);
      
      // Check if response is ok and content-type is JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      
      const data = await response.json();
      
      const books: Book[] = data.works?.slice(0, 8).map((work: any, index: number) => ({
        id: `rec-${index}`,
        title: work.title,
        author: work.authors?.[0]?.name || 'Unknown Author',
        cover: work.cover_id 
          ? `https://covers.openlibrary.org/b/id/${work.cover_id}-M.jpg`
          : undefined,
        description: work.subject?.slice(0, 3).join(', ') || 'No description available',
        publishYear: work.first_publish_year
      })) || [];
      
      setRecommendations(books);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Fallback recommendations
      setRecommendations([
        {
          id: 'fallback-1',
          title: 'Pride and Prejudice',
          author: 'Jane Austen',
          cover: 'https://covers.openlibrary.org/b/isbn/9780141439518-M.jpg',
          description: 'A romantic novel of manners'
        },
        {
          id: 'fallback-2',
          title: 'The Catcher in the Rye',
          author: 'J.D. Salinger',
          cover: 'https://covers.openlibrary.org/b/isbn/9780316769174-M.jpg',
          description: 'A controversial coming-of-age story'
        }
      ]);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const searchBooks = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      setIsSearching(true);
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`);
      
      // Check if response is ok and content-type is JSON
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      
      const data = await response.json();
      
      const books: Book[] = data.docs?.map((doc: any, index: number) => ({
        id: `search-${index}`,
        title: doc.title,
        author: doc.author_name?.[0] || 'Unknown Author',
        cover: doc.cover_i 
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
          : undefined,
        description: doc.subject?.slice(0, 3).join(', ') || 'No description available',
        publishYear: doc.first_publish_year,
        isbn: doc.isbn?.[0]
      })) || [];
      
      setSearchResults(books);
    } catch (error) {
      console.error('Error searching books:', error);
      setSearchResults([]); // Clear results on error
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleUpdateProgress = (bookId: string, progress: number) => {
    setReadBooks(prev => prev.map(book => 
      book.id === bookId ? { ...book, progress } : book
    ));
  };

  const addBookToReading = (book: Book) => {
    const userBook: UserBook = {
      ...book,
      progress: 0,
      dateStarted: new Date().toISOString().split('T')[0]
    };
    setReadBooks(prev => [...prev, userBook]);
  };

  const openStoryReader = (book: UserBook) => {
    if (book.content) {
      setCurrentReading(book);
      setReadingMode(true);
    } else {
      alert('This book does not have story content available yet.');
    }
  };

  const closeReader = () => {
    setReadingMode(false);
    setCurrentReading(null);
  };

  // Story writing functions
  const startNewStory = () => {
    setCurrentStory({
      title: '',
      author: user?.email?.split('@')[0] || 'Anonymous',
      content: '',
      description: ''
    });
    setIsEditingExistingStory(false);
    setEditingStoryId(null);
    setWritingMode(true);
  };

  const editExistingStory = (story: UserBook) => {
    setCurrentStory({
      title: story.title,
      author: story.author,
      content: story.content || '',
      description: story.description || ''
    });
    setIsEditingExistingStory(true);
    setEditingStoryId(story.id);
    setWritingMode(true);
  };

  const saveStory = () => {
    if (!currentStory.title.trim() || !currentStory.content.trim()) {
      alert('Please provide both a title and content for your story.');
      return;
    }

    const newStory: UserBook = {
      id: isEditingExistingStory && editingStoryId ? editingStoryId : `user-story-${Date.now()}`,
      title: currentStory.title,
      author: currentStory.author,
      description: currentStory.description,
      content: currentStory.content,
      progress: 0,
      dateStarted: new Date().toISOString().split('T')[0],
      cover: undefined // User stories don't have covers by default
    };

    if (isEditingExistingStory && editingStoryId) {
      // Update existing story in both user stories and read books
      setUserStories(prev => prev.map(story => 
        story.id === editingStoryId ? newStory : story
      ));
      setReadBooks(prev => prev.map(book => 
        book.id === editingStoryId ? newStory : book
      ));
    } else {
      // Add new story
      setUserStories(prev => [...prev, newStory]);
      setReadBooks(prev => [...prev, newStory]);
    }

    // Close writing mode
    setWritingMode(false);
    setCurrentStory({ title: '', author: user?.email?.split('@')[0] || 'Anonymous', content: '', description: '' });
    setIsEditingExistingStory(false);
    setEditingStoryId(null);
  };

  const deleteStory = (storyId: string) => {
    if (confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      setUserStories(prev => prev.filter(story => story.id !== storyId));
      setReadBooks(prev => prev.filter(book => book.id !== storyId));
    }
  };

  const closeWriter = () => {
    if (currentStory.title.trim() || currentStory.content.trim()) {
      if (confirm('You have unsaved changes. Are you sure you want to close without saving?')) {
        setWritingMode(false);
        setCurrentStory({ title: '', author: user?.email?.split('@')[0] || 'Anonymous', content: '', description: '' });
        setIsEditingExistingStory(false);
        setEditingStoryId(null);
      }
    } else {
      setWritingMode(false);
    }
  };

  const BookCard = ({ book, isRecommendation = false }: { book: UserBook | Book; isRecommendation?: boolean }) => {
    const userBook = book as UserBook;
    const isUserBook = 'progress' in book;
    
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 p-4 min-w-[220px] max-w-[220px]">
        <div 
          className="aspect-[3/4] mb-3 rounded-lg overflow-hidden bg-gradient-to-br from-purple-200 to-pink-200 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => {
            if (isUserBook && (book as UserBook).content) {
              openStoryReader(book as UserBook);
            } else if (isUserBook) {
              alert('This book does not have story content available yet.');
            }
          }}
        >
          {book.cover ? (
            <img 
              src={book.cover} 
              alt={book.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDEyMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNFOEZGIi8+CjxwYXRoIGQ9Ik00MCA1MEg4MFY3MEg0MFY1MFoiIGZpbGw9IiNBODU1RjciLz4KPHA+PHRleHQgeD0iNjAiIHk9IjkwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM4QjVDRjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJvb2s8L3RleHQ+PC9wPgo8L3N2Zz4=';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">📚</div>
          )}
          
          {/* Reading indicator overlay */}
          {isUserBook && (book as UserBook).content && (
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
              <div className="text-white opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-2xl">📖</span>
                <p className="text-xs mt-1">Click to Read</p>
              </div>
            </div>
          )}
        </div>
        
        <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2 min-h-[2.5rem]">
          {book.title}
        </h3>
        
        <p className="text-xs text-purple-600 mb-2 line-clamp-1">
          by {book.author}
        </p>
        
        {isUserBook && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="text-purple-600 font-semibold">{userBook.progress}%</span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${userBook.progress}%` }}
              />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={userBook.progress}
              onChange={(e) => handleUpdateProgress(book.id, Number(e.target.value))}
              className="w-full mt-2 accent-purple-600"
            />
          </div>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedBook(book)}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-2 rounded-lg transition-colors"
          >
            View Details
          </button>
          
          {isRecommendation && (
            <button
              onClick={() => addBookToReading(book as Book)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2 rounded-lg transition-colors"
            >
              Add to Library
            </button>
          )}
        </div>
        
        {isUserBook && (
          <div className="mt-2">
            {userBook.progress === 100 ? (
              <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                ✓ Completed
              </span>
            ) : userBook.progress > 0 ? (
              <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                📖 Reading
              </span>
            ) : (
              <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                📚 To Read
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-purple-700">Account</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-3">
                <span className="text-white text-xl font-bold">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <p className="font-medium text-gray-800">{user?.email}</p>
              <p className="text-sm text-gray-600">Libris Reader</p>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Books Read:</span>
                <span className="font-semibold">{readBooks.filter(b => b.progress === 100).length}</span>
              </div>
              <div className="flex justify-between">
                <span>Currently Reading:</span>
                <span className="font-semibold">{readBooks.filter(b => b.progress > 0 && b.progress < 100).length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Books:</span>
                <span className="font-semibold">{readBooks.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Stories Written:</span>
                <span className="font-semibold">{userStories.length}</span>
              </div>
            </div>
            
            {/* Writing Mode Toggle */}
            <div className="space-y-2">
              <button
                onClick={startNewStory}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>✍️</span>
                Write New Story
              </button>
              
              {userStories.length > 0 && (
                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-purple-700 hover:text-purple-800 flex items-center gap-2">
                    <span>📚</span>
                    <span>My Stories ({userStories.length})</span>
                    <span className="ml-auto transform group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                    {userStories.map((story) => (
                      <div key={story.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{story.title}</p>
                          <p className="text-gray-500 truncate">by {story.author}</p>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <button
                            onClick={() => editExistingStory(story)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                            title="Edit story"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteStory(story.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                            title="Delete story"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>🚪</span>
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="bg-white hover:bg-gray-50 p-3 rounded-lg shadow-md transition-colors"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className="h-0.5 bg-purple-600 rounded"></div>
              <div className="h-0.5 bg-purple-600 rounded"></div>
              <div className="h-0.5 bg-purple-600 rounded"></div>
            </div>
          </button>
          
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
            📚 Libris Dashboard
          </h1>
          
          {/* Admin Panel Link */}
          {user && isUserAdmin(user.email || '') && (
            <button
              onClick={() => router.push('/admin')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-2"
            >
              <span>⚙️</span>
              Admin Panel
            </button>
          )}
          
          {!user || !isUserAdmin(user.email || '') ? (
            <div className="w-12"></div> /* Spacer */
          ) : null}
        </div>
        
        {/* Trial Status */}
        <TrialStatus trialData={trialData} isLoading={isLoadingTrial} />
        
        {/* Access Restricted Message */}
        {isAccessRestricted && (
          <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">⏳</span>
              <h2 className="text-xl font-bold text-yellow-800">Limited Access</h2>
            </div>
            <p className="text-yellow-700 mb-3">
              Your trial has expired and your account is pending approval. You have limited access to the application.
            </p>
            <p className="text-sm text-yellow-600">
              Contact support if you have any questions about your account status.
            </p>
          </div>
        )}
        
        {/* Search Section */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for books..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                searchBooks(e.target.value);
              }}
              className="w-full px-4 py-3 pl-12 rounded-xl border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400">
              🔍
            </div>
            {isSearching && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
              </div>
            )}
          </div>
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 bg-white rounded-xl p-4 shadow-lg max-h-60 overflow-y-auto">
              <h3 className="font-semibold text-gray-800 mb-2">Search Results</h3>
              <div className="space-y-2">
                {searchResults.map((book) => (
                  <div key={book.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors" onClick={() => setSelectedBook(book)}>
                    <div className="w-10 h-12 bg-purple-100 rounded flex items-center justify-center text-xs">
                      {book.cover ? (
                        <img src={book.cover} alt={book.title} className="w-full h-full object-cover rounded" />
                      ) : (
                        '📚'
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-gray-800 line-clamp-1">{book.title}</h4>
                      <p className="text-xs text-gray-600">{book.author}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addBookToReading(book);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-2 py-1 rounded transition-colors"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* My Books Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            📖 My Library ({readBooks.length} books)
          </h2>
          
          {readBooks.length === 0 ? (
            <div className="bg-white/60 rounded-xl p-8 text-center">
              <p className="text-gray-600 mb-4">No books in your library yet!</p>
              <p className="text-sm text-gray-500">Search for books above to add them to your library.</p>
            </div>
          ) : (
            <div className="flex overflow-x-auto gap-6 pb-4">
              {readBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </section>
        
        {/* Recommendations Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              ✨ Recommended for You
            </h2>
            <button
              onClick={fetchRecommendations}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Refresh
            </button>
          </div>
          
          {isLoadingRecommendations ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <div className="flex overflow-x-auto gap-6 pb-4">
              {recommendations.map((book) => (
                <BookCard key={book.id} book={book} isRecommendation />
              ))}
            </div>
          )}
        </section>
      </div>
      
      {/* Book Details Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800 pr-8">{selectedBook.title}</h2>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              
              <div className="flex gap-4 mb-4">
                <div className="w-24 h-32 bg-purple-100 rounded-lg overflow-hidden flex-shrink-0">
                  {selectedBook.cover ? (
                    <img src={selectedBook.cover} alt={selectedBook.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">📚</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-purple-600 font-medium mb-2">by {selectedBook.author}</p>
                  {selectedBook.publishYear && (
                    <p className="text-sm text-gray-600 mb-1">Published: {selectedBook.publishYear}</p>
                  )}
                  {'progress' in selectedBook && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span className="font-semibold">{selectedBook.progress}%</span>
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${selectedBook.progress}%` }}
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={selectedBook.progress}
                        onChange={(e) => handleUpdateProgress(selectedBook.id, Number(e.target.value))}
                        className="w-full accent-purple-600"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {selectedBook.description && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{selectedBook.description}</p>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedBook(null)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                >
                  Close
                </button>
                {!('progress' in selectedBook) && (
                  <button
                    onClick={() => {
                      addBookToReading(selectedBook as Book);
                      setSelectedBook(null);
                    }}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Add to Library
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Story Reader Modal */}
      {readingMode && currentReading && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-4xl h-full max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            {/* Reader Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h1 className="text-2xl font-bold">{currentReading.title}</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">by {currentReading.author}</p>
              </div>
              
              {/* Reading Controls */}
              <div className="flex items-center gap-4">
                {/* Font Size Controls */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Decrease font size"
                  >
                    🔽
                  </button>
                  <span className="text-sm font-medium">{fontSize}px</span>
                  <button 
                    onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Increase font size"
                  >
                    🔼
                  </button>
                </div>
                
                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>
                
                {/* Close Button */}
                <button
                  onClick={closeReader}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-xl"
                  aria-label="Close reader"
                >
                  ✕
                </button>
              </div>
            </div>
            
            {/* Story Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <div 
                className="max-w-none prose prose-lg mx-auto leading-relaxed"
                style={{ 
                  fontSize: `${fontSize}px`,
                  lineHeight: '1.8',
                  fontFamily: 'Georgia, serif'
                }}
              >
                {currentReading.content?.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('Chapter ') || paragraph.startsWith('Epilogue:')) {
                    return (
                      <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-purple-700 dark:text-purple-400">
                        {paragraph}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('The End')) {
                    return (
                      <div key={index} className="text-center mt-12 mb-8">
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {paragraph}
                        </p>
                        <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">How did you enjoy this story?</p>
                          <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button key={star} className="text-2xl hover:scale-110 transition-transform">
                                ⭐
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <p key={index} className="mb-4 text-justify">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>
            
            {/* Reading Progress Bar */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Reading Progress:</span>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${currentReading.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentReading.progress}
                    onChange={(e) => handleUpdateProgress(currentReading.id, Number(e.target.value))}
                    className="w-20 accent-purple-600"
                  />
                  <span className="text-sm font-semibold min-w-[3rem]">{currentReading.progress}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Story Writing Modal */}
      {writingMode && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl h-full max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col">
            {/* Writer Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-50 to-blue-50">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {isEditingExistingStory ? '✏️ Edit Story' : '✍️ Write New Story'}
                </h1>
                <p className="text-sm text-gray-600">
                  {isEditingExistingStory ? 'Edit your existing story' : 'Create your masterpiece'}
                </p>
              </div>
              
              {/* Writer Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={saveStory}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>💾</span>
                  {isEditingExistingStory ? 'Update Story' : 'Save Story'}
                </button>
                
                <button
                  onClick={closeWriter}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-xl text-gray-600"
                  aria-label="Close writer"
                >
                  ✕
                </button>
              </div>
            </div>
            
            {/* Story Form */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Story Title */}
                <div>
                  <label htmlFor="story-title" className="block text-sm font-medium text-gray-700 mb-2">
                    Story Title *
                  </label>
                  <input
                    id="story-title"
                    type="text"
                    value={currentStory.title}
                    onChange={(e) => setCurrentStory(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter a captivating title for your story..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-lg font-medium"
                  />
                </div>
                
                {/* Author Name */}
                <div>
                  <label htmlFor="story-author" className="block text-sm font-medium text-gray-700 mb-2">
                    Author
                  </label>
                  <input
                    id="story-author"
                    type="text"
                    value={currentStory.author}
                    onChange={(e) => setCurrentStory(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Your name or pen name..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  />
                </div>
                
                {/* Story Description */}
                <div>
                  <label htmlFor="story-description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    id="story-description"
                    value={currentStory.description}
                    onChange={(e) => setCurrentStory(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="A brief description of your story..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none"
                  />
                </div>
                
                {/* Story Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="story-content" className="block text-sm font-medium text-gray-700">
                      Story Content *
                    </label>
                    <div className="text-xs text-gray-500">
                      {currentStory.content.length} characters
                    </div>
                  </div>
                  <textarea
                    id="story-content"
                    value={currentStory.content}
                    onChange={(e) => setCurrentStory(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Begin your story here... \n\nTip: Use 'Chapter 1:', 'Chapter 2:', etc. to organize your story into chapters."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none font-serif text-base leading-relaxed"
                    style={{ 
                      minHeight: '400px', 
                      fontFamily: 'Georgia, serif',
                      lineHeight: '1.6'
                    }}
                  />
                </div>
                
                {/* Writing Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">✨ Writing Tips</h3>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Use "Chapter 1:", "Chapter 2:", etc. to create chapter breaks</li>
                    <li>• Separate paragraphs with empty lines for better formatting</li>
                    <li>• Use "Epilogue:" for a final chapter</li>
                    <li>• End with "The End." for a satisfying conclusion</li>
                    <li>• Take your time - great stories develop with care and revision</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Writer Footer */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                <div className="text-sm text-gray-600">
                  {isEditingExistingStory ? (
                    <span>📝 Editing: {currentStory.title || 'Untitled Story'}</span>
                  ) : (
                    <span>✍️ Ready to create something amazing?</span>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={closeWriter}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={saveStory}
                    disabled={!currentStory.title.trim() || !currentStory.content.trim()}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <span>💾</span>
                    {isEditingExistingStory ? 'Update Story' : 'Save Story'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
