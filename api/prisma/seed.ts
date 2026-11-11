import { PrismaClient, Role, LoanStatus } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Clean existing data to avoid unique constraint collisions on re-seed
  await prisma.loan.deleteMany();
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.user.deleteMany();

  // Create Genres
  const genreData = [
    { name: "Fantasy", slug: "fantasy" },
    { name: "Science Fiction", slug: "science-fiction" },
    { name: "Mystery", slug: "mystery" },
    { name: "Biography", slug: "biography" },
  ];

  const genres = await Promise.all(
    genreData.map((g) => prisma.genre.create({ data: g })),
  );

  // Create Sample Users
  const librarian = await prisma.user.create({
    data: {
      email: "librarian@library.com",
      password: "securepassword123",
      role: Role.LIBRARIAN,
    },
  });

  const patron = await prisma.user.create({
    data: {
      email: "patron@student.com",
      password: "securepassword123",
      role: Role.PATRON,
    },
  });

  // 16 Complete Books (4 per genre)
  const sampleBooks = [
    // Fantasy
    { title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy" },
    { title: "The Fellowship of the Ring", author: "J.R.R. Tolkien", genre: "Fantasy" },
    { title: "A Game of Thrones", author: "George R.R. Martin", genre: "Fantasy" },
    { title: "The Name of the Wind", author: "Patrick Rothfuss", genre: "Fantasy" },
    
    // Science Fiction
    { title: "Dune", author: "Frank Herbert", genre: "Science Fiction" },
    { title: "Neuromancer", author: "William Gibson", genre: "Science Fiction" },
    { title: "Foundation", author: "Isaac Asimov", genre: "Science Fiction" },
    { title: "Hyperion", author: "Dan Simmons", genre: "Science Fiction" },

    // Mystery
    { title: "The Big Sleep", author: "Raymond Chandler", genre: "Mystery" },
    { title: "The Hound of the Baskervilles", author: "Arthur Conan Doyle", genre: "Mystery" },
    { title: "Gone Girl", author: "Gillian Flynn", genre: "Mystery" },
    { title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", genre: "Mystery" },

    // Biography
    { title: "Educated", author: "Tara Westover", genre: "Biography" },
    { title: "The Diary of a Young Girl", author: "Anne Frank", genre: "Biography" },
    { title: "Steve Jobs", author: "Walter Isaacson", genre: "Biography" },
    { title: "Becoming", author: "Michelle Obama", genre: "Biography" },
  ];

  const createdBooks = [];
  for (const book of sampleBooks) {
    const genre = genres.find((g) => g.name === book.genre);
    const newBook = await prisma.book.create({
      data: {
        title: book.title,
        author: book.author,
        isbn: `978${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        description: `Acclaimed work titled ${book.title} authored by ${book.author}.`,
        totalCopies: 3,
        availableCopies: 2,
        genreId: genre.id,
      },
    });
    createdBooks.push(newBook);
  }

  // Seed initial active loan record
  const dueDateTime = new Date();
  dueDateTime.setDate(dueDateTime.getDate() + 14);

  await prisma.loan.create({
    data: {
      userId: patron.id,
      bookId: createdBooks[0].id,
      dueDate: dueDateTime,
      status: LoanStatus.ACTIVE,
    },
  });

  console.log("Database seeded successfully with genres, users, 16 books, and loan records!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });