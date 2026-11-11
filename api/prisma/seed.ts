import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create Genres (4+ required)
  const fiction = await prisma.genre.upsert({
    where: { name: 'Literary Fiction' },
    update: {},
    create: { name: 'Literary Fiction', description: 'Prose fiction focused on depth of character and theme.' },
  });

  const sciFi = await prisma.genre.upsert({
    where: { name: 'Science Fiction' },
    update: {},
    create: { name: 'Science Fiction', description: 'Futuristic concepts, space exploration, and advanced tech.' },
  });

  const fantasy = await prisma.genre.upsert({
    where: { name: 'Fantasy' },
    update: {},
    create: { name: 'Fantasy', description: 'Magical and supernatural elements set in fictional universes.' },
  });

  const tech = await prisma.genre.upsert({
    where: { name: 'Computer Science' },
    update: {},
    create: { name: 'Computer Science', description: 'Software engineering, system design, and programming.' },
  });

  const history = await prisma.genre.upsert({
    where: { name: 'History' },
    update: {},
    create: { name: 'History', description: 'Non-fiction recounting past human events and eras.' },
  });

  // 2. Create Users (Patron & Librarian)
  const librarian = await prisma.user.upsert({
    where: { email: 'head.librarian@library.org' },
    update: {},
    create: {
      email: 'head.librarian@library.org',
      name: 'Amina Mwangi',
      role: Role.LIBRARIAN,
    },
  });

  const patron = await prisma.user.upsert({
    where: { email: 'stacey.patron@student.edu' },
    update: {},
    create: {
      email: 'stacey.patron@student.edu',
      name: 'Stacey Wanjiku',
      role: Role.PATRON,
    },
  });

  // 3. Insert 15+ Books distributed across genres
  const booksData = [
    // Literary Fiction
    { title: 'The River and the Source', author: 'Margaret Ogola', isbn: '978-9966846171', publishedYear: 1994, copiesAvailable: 4, genreId: fiction.id },
    { title: 'Things Fall Apart', author: 'Chinua Achebe', isbn: '978-0385474542', publishedYear: 1958, copiesAvailable: 6, genreId: fiction.id },
    { title: 'Americanah', author: 'Chimamanda Ngozi Adichie', isbn: '978-0307455925', publishedYear: 2013, copiesAvailable: 3, genreId: fiction.id },
    { title: 'Petals of Blood', author: 'Ngũgĩ wa Thiong\'o', isbn: '978-0141187020', publishedYear: 1977, copiesAvailable: 2, genreId: fiction.id },

    // Science Fiction
    { title: 'Dune', author: 'Frank Herbert', isbn: '978-0441172719', publishedYear: 1965, copiesAvailable: 5, genreId: sciFi.id },
    { title: 'Neuromancer', author: 'William Gibson', isbn: '978-0441569595', publishedYear: 1984, copiesAvailable: 3, genreId: sciFi.id },
    { title: 'The Three-Body Problem', author: 'Liu Cixin', isbn: '978-0765382030', publishedYear: 2008, copiesAvailable: 4, genreId: sciFi.id },
    { title: 'Snow Crash', author: 'Neal Stephenson', isbn: '978-0553380958', publishedYear: 1992, copiesAvailable: 2, genreId: sciFi.id },

    // Fantasy
    { title: 'The Way of Kings', author: 'Brandon Sanderson', isbn: '978-0765326357', publishedYear: 2010, copiesAvailable: 3, genreId: fantasy.id },
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '978-0547928227', publishedYear: 1937, copiesAvailable: 7, genreId: fantasy.id },
    { title: 'Name of the Wind', author: 'Patrick Rothfuss', isbn: '978-0756404749', publishedYear: 2007, copiesAvailable: 4, genreId: fantasy.id },

    // Computer Science
    { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', isbn: '978-1449373328', publishedYear: 2017, copiesAvailable: 5, genreId: tech.id },
    { title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', publishedYear: 2008, copiesAvailable: 6, genreId: tech.id },
    { title: 'Pragmatic Programmer', author: 'Andrew Hunt & David Thomas', isbn: '978-0201616224', publishedYear: 1999, copiesAvailable: 4, genreId: tech.id },

    // History
    { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', isbn: '978-0062316096', publishedYear: 2014, copiesAvailable: 5, genreId: history.id },
    { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', isbn: '978-0393317558', publishedYear: 1997, copiesAvailable: 3, genreId: history.id },
  ];

  for (const b of booksData) {
    await prisma.book.upsert({
      where: { isbn: b.isbn },
      update: {},
      create: b,
    });
  }

  // 4. Create sample review (Stretch Goal)
  const sampleBook = await prisma.book.findFirst({ where: { title: 'Designing Data-Intensive Applications' } });
  if (sampleBook) {
    await prisma.createReviewOrSkip?: any;
    await prisma.review.createMany({
      skipDuplicates: true,
      data: [
        {
          rating: 5,
          comment: 'An absolute masterpiece for understanding distributed systems and databases!',
          bookId: sampleBook.id,
          userId: patron.id,
        },
      ],
    });
  }

  console.log('✅ Seeding completed successfully! 17 books and 5 genres loaded.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });