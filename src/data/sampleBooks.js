const sampleBooks = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic',
    totalPages: 180,
    currentPage: 120,
    status: 'reading',
    rating: 4,
    notes: 'A masterful exploration of the American Dream. The prose is hauntingly beautiful.',
    favourite: true,
    dateAdded: '2026-01-15T10:00:00.000Z',
    dateCompleted: null
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Classic',
    totalPages: 281,
    currentPage: 281,
    status: 'completed',
    rating: 5,
    notes: 'Timeless story of justice and moral growth. Scout is an unforgettable narrator.',
    favourite: true,
    dateAdded: '2025-12-01T10:00:00.000Z',
    dateCompleted: '2026-01-10T10:00:00.000Z'
  },
  {
    id: '3',
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Sci-Fi',
    totalPages: 688,
    currentPage: 0,
    status: 'want-to-read',
    rating: 0,
    notes: '',
    favourite: false,
    dateAdded: '2026-02-20T10:00:00.000Z',
    dateCompleted: null
  },
  {
    id: '4',
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian',
    totalPages: 328,
    currentPage: 328,
    status: 'completed',
    rating: 5,
    notes: 'Chilling and prophetic. Big Brother is always watching.',
    favourite: true,
    dateAdded: '2025-11-05T10:00:00.000Z',
    dateCompleted: '2025-12-15T10:00:00.000Z'
  },
  {
    id: '5',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    totalPages: 310,
    currentPage: 185,
    status: 'reading',
    rating: 4,
    notes: 'Bilbo\'s adventure is delightful. The riddles with Gollum are iconic.',
    favourite: false,
    dateAdded: '2026-03-01T10:00:00.000Z',
    dateCompleted: null
  },
  {
    id: '6',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    genre: 'Non-Fiction',
    totalPages: 443,
    currentPage: 443,
    status: 'completed',
    rating: 4,
    notes: 'A sweeping history of humankind. Some claims feel oversimplified but still fascinating.',
    favourite: false,
    dateAdded: '2025-10-10T10:00:00.000Z',
    dateCompleted: '2025-11-20T10:00:00.000Z'
  },
  {
    id: '7',
    title: 'The Name of the Wind',
    author: 'Patrick Rothfuss',
    genre: 'Fantasy',
    totalPages: 662,
    currentPage: 0,
    status: 'want-to-read',
    rating: 0,
    notes: 'Highly recommended by friends. Adding to reading list.',
    favourite: false,
    dateAdded: '2026-03-15T10:00:00.000Z',
    dateCompleted: null
  },
  {
    id: '8',
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Help',
    totalPages: 320,
    currentPage: 320,
    status: 'completed',
    rating: 5,
    notes: 'Practical, actionable advice. The 1% improvement concept is life-changing.',
    favourite: true,
    dateAdded: '2026-01-20T10:00:00.000Z',
    dateCompleted: '2026-02-28T10:00:00.000Z'
  }
];

export const readingQuotes = [
  { text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.", author: "George R.R. Martin" },
  { text: "Books are a uniquely portable magic.", author: "Stephen King" },
  { text: "There is no friend as loyal as a book.", author: "Ernest Hemingway" },
  { text: "Reading is to the mind what exercise is to the body.", author: "Joseph Addison" },
  { text: "So many books, so little time.", author: "Frank Zappa" },
  { text: "A room without books is like a body without a soul.", author: "Marcus Tullius Cicero" },
  { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
  { text: "Until I feared I would lose it, I never loved to read. One does not love breathing.", author: "Harper Lee" },
  { text: "I have always imagined that Paradise will be a kind of library.", author: "Jorge Luis Borges" },
  { text: "Reading gives us someplace to go when we have to stay where we are.", author: "Mason Cooley" },
  { text: "One glance at a book and you hear the voice of another person, perhaps someone dead for 1,000 years.", author: "Carl Sagan" },
  { text: "Think before you speak. Read before you think.", author: "Fran Lebowitz" }
];

export const genreColors = {
  'Classic': '#8B6914',
  'Sci-Fi': '#2E86AB',
  'Fantasy': '#7B2D8E',
  'Dystopian': '#C23B22',
  'Non-Fiction': '#2D6A4F',
  'Self-Help': '#E07A5F',
  'Mystery': '#3D405B',
  'Romance': '#E8788A',
  'Horror': '#4A0E0E',
  'Biography': '#457B9D',
  'History': '#BC6C25',
  'Poetry': '#6D597A',
  'Thriller': '#1B263B',
  'Other': '#6C757D'
};

export const coverColors = [
  '#1B4332', '#2D3A2D', '#3A2D2D', '#2D2D3A',
  '#4A3728', '#2C3E50', '#3D2B1F', '#1A3A4A',
  '#462D44', '#2B4141', '#3E362E', '#1D3557'
];

export const getCoverColor = (title) => {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return coverColors[Math.abs(hash) % coverColors.length];
};

export default sampleBooks;
