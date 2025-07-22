**Creating Project**

```
npx create-next-app@latest
```

**Packages**

---

```
npm i fs-extra
```

---

**Install Commands**

---

```
npm install prisma --save-dev 
npm install @prisma/client 
npx prisma init --datasource-provider sqlite 

```

**Create the Schema Models**

![1745832240019](image/prisma-commands/1745832240019.png)
![My Image](model.png)


**Generate the databse and view**

```
npx prisma migrate dev --name init 
npx prisma migrate dev 
npx prisma studio
```

**Seed Database**

---

```
import { PrismaClient } from "@prisma/client"
import fs from "fs-extra"
import path from "path"

const prisma = new PrismaClient()

async function seed() {
    console.log("Seeding Started.....");

    const authors = await fs.readJSON(path.join(process.cwd(), 'app/data/authors.json'))
    const books = await fs.readJSON(path.join(process.cwd(), 'app/data/books.json'))

    for (const author of authors)
        await prisma.author.create({ data: author })
    for (const book of books)
        await prisma.book.create({ data: book })

    prisma.$disconnect
    console.log('Completed Seeding');

}

seed()

```

**Create the Repository**

```
// Get all books
async function getAllBooks() {}

// Get a specific book by ID
async function getBookById(bookId) {}

// Create a new book
async function createBook(bookData) {}

// Update an existing book
async function updateBook(bookId, updatedData) {}

// Delete a book
async function deleteBook(bookId) {}

// Get all authors
async function getAllAuthors() {}

// Get a specific author by ID
async function getAuthorById(authorId) {}

// Create a new author
async function createAuthor(authorData) {}

// Update an existing author
async function updateAuthor(authorId, updatedData) {}

// Delete an author
async function deleteAuthor(authorId) {}
```

---

**Create the Routes**

---

| Method | Route      | Description               |
| :----- | :--------- | :------------------------ |
| GET    | /books     | Get all books             |
| GET    | /books/:id | Get a specific book by ID |
| POST   | /books     | Add a new book            |
| PUT    | /books/:id | Update an existing book   |
| DELETE | /books/:id | Delete a book             |

| Method | Route        | Description                 |
| :----- | :----------- | :-------------------------- |
| GET    | /authors     | Get all authors             |
| GET    | /authors/:id | Get a specific author by ID |
| POST   | /authors     | Add a new author            |
| PUT    | /authors/:id | Update an existing author   |
| DELETE | /authors/:id | Delete an author            |

**Card Design**

---

Copy this card code

```
`<div className="author-card">
  <img src="photo-url.jpg" alt="Author Name" className="author-photo" />
  <div className="author-info">
    <h2 className="author-name">Author Name</h2>
    <p className="author-bio">This is a short author biography or description.</p>
  </div>
</div>`
```
