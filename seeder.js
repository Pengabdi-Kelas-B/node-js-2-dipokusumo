const mongoose = require('mongoose');

const { 
  Book, 
  Author, 
  Category, 
  Borrower, 
  BookStock 
} = require('./src/models');

require('dotenv').config()

const seedData = {
  categories: [
    {
      name: 'Fiction',
      description: 'Fictional literature and stories'
    },
    {
      name: 'Non-Fiction',
      description: 'Educational and factual books'
    },
    {
      name: 'Science',
      description: 'Scientific topics and research'
    },
    {
      name: 'Technology',
      description: 'Computer science and technology related books'
    }
  ],

  authors: [
    {
      name: 'John Doe',
      bio: 'Bestselling author of fiction novels',
      birthDate: '1980-01-15',
      photoUrl: null
    },
    {
      name: 'Jane Smith',
      bio: 'Award-winning science writer',
      birthDate: '1975-06-22',
      photoUrl: null
    },
    {
      name: 'Robert Johnson',
      bio: 'Technology expert and veteran programmer',
      birthDate: '1985-03-30',
      photoUrl: null
    }
  ],

  books: [
    {
      title: 'The Art of Programming',
      description: 'A comprehensive guide to programming fundamentals',
      isbn: '978-0-123456-78-9',
      totalPages: 450,
      publisher: 'Tech Publishing House',
      language: 'English',
      publishedDate: '2023-01-15'
    },
    {
      title: 'Universe Mysteries',
      description: 'Exploring the mysteries of our universe',
      isbn: '978-0-987654-32-1',
      totalPages: 300,
      publisher: 'Science Books Inc',
      language: 'English',
      publishedDate: '2023-02-20'
    },
    {
      title: 'The Lost City',
      description: 'An adventure novel about a hidden civilization',
      isbn: '978-0-111222-33-4',
      totalPages: 280,
      publisher: 'Story Press',
      language: 'English',
      publishedDate: '2023-03-10'
    }
  ],

  borrowers: [
    {
      membershipId: 'MEM001',
      name: 'Alice Cooper',
      email: 'alice@example.com',
      phone: '123-456-7890',
      address: '123 Main St, City',
      status: 'ACTIVE'
    },
    {
      membershipId: 'MEM002',
      name: 'Bob Wilson',
      email: 'bob@example.com',
      phone: '098-765-4321',
      address: '456 Oak St, City',
      status: 'ACTIVE'
    }
  ]
};

async function seedDatabase() {
  try {
    // Clear existing data
    await mongoose.connection.dropDatabase();
    console.log('Cleared existing database');

    // Create categories
    const categories = await Category.insertMany(seedData.categories);
    console.log('Categories seeded');

    // Create authors
    const authors = await Author.insertMany(seedData.authors);
    console.log('Authors seeded');

    // Create books with references
    const books = await Promise.all(seedData.books.map(async (book, index) => {
      const newBook = new Book({
        ...book,
        categoryId: categories[index % categories.length]._id,
        authorId: authors[index % authors.length]._id
      });
      await newBook.save();
      return newBook;
    }));
    console.log('Books seeded');

    // Update authors with their books
    await Promise.all(authors.map(async (author, index) => {
      const authorBooks = books.filter((_, bookIndex) => bookIndex % authors.length === index);
      author.books = authorBooks.map(book => book._id);
      await author.save();
    }));
    console.log('Author books updated');

    // Create borrowers
    const borrowers = await Borrower.insertMany(seedData.borrowers);
    console.log('Borrowers seeded');

    // Create initial stock for each book
    await Promise.all(books.map(async (book) => {
      await BookStock.create({
        bookId: book._id,
        totalQuantity: 5,
        availableQuantity: 5,
        borrowedQuantity: 0
      });
    }));
    console.log('Book stocks seeded');

    console.log('Database seeded successfully!');
    
    // Log some sample data for verification
    console.log('\nSample Data Created:');
    console.log(`Categories: ${categories.length}`);
    console.log(`Authors: ${authors.length}`);
    console.log(`Books: ${books.length}`);
    console.log(`Borrowers: ${borrowers.length}`);

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Script execution
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await seedDatabase();
    process.exit(0);
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });