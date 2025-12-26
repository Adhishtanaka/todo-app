# Todo & Notes App

A comprehensive productivity application built with **Next.js**, **PostgreSQL**, **Flutter**, and **Prisma**, hosted on **Netlify**. This project demonstrates modern full-stack development with **Next.js API routes**, **JWT authentication**, **Markdown support**, and cross-platform access for both web and mobile clients.

<img src="screenshot/a1.png" alt="TodoApp View" style="width: 700px;" />

## Features

### Todo Management
-  Create, update, delete, and search todos
-  Deadline tracking with overdue indicators
-  Inline editing with real-time updates
-  Loading animations for better UX
-  Responsive design for all devices

### Notes System
-  Rich markdown editor with live preview
-  Syntax highlighting and formatting
-  Expandable/collapsible note cards
-  Full-text search across all notes
-  GitHub Flavored Markdown (GFM) support

## Local Development

```bash
# Clone the repository
git clone https://github.com/Adhishtanaka/todo-app.git
cd todo-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Database setup
npx prisma migrate dev
npx prisma generate

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/todoapp"
JWT_SECRET="your-super-secret-jwt-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Headless UI
- **Backend**: Next.js API Routes, JWT Authentication
- **Database**: PostgreSQL with Prisma ORM
- **Markdown**: ReactMarkdown with GitHub Flavored Markdown
- **Mobile**: Flutter (separate repository)
- **Deployment**: Netlify

## Project Structure

```
├── app/
│   ├── api/           # API routes
│   │   ├── auth/      # Authentication endpoints
│   │   ├── todos/     # Todo CRUD operations
│   │   └── notes/     # Notes CRUD operations
│   ├── auth/          # Auth pages (signin/signup)
│   └── page.tsx       # Main application
├── components/        # React components
│   ├── AddNote.tsx    # Markdown note editor
│   ├── AddTodo.tsx    # Todo creation form
│   ├── NoteItem.tsx   # Note display with markdown
│   ├── TodoItem.tsx   # Todo item with actions
│   ├── ProfileButton.tsx # User profile dropdown
├── prisma/
│   ├── schema.prisma  # Database schema
│   └── migrations/    # Database migrations
└── public/           # Static assets
```

---

## Notes

- This is not production-hardened. It’s built for educational purposes.
- Rate limiting, CORS policies, and secure storage practices should be added for deployment.

---

## License

This Webapplication is open source and available under the [MIT License](LICENSE).

## Contact

- **Author**: [Adhishtanaka](https://github.com/Adhishtanaka)
- **Email**: kulasoooriyaa@gmail.com

## Contributing

If you find any bugs or want to suggest improvements, feel free to open an issue or pull request on the [GitHub repository](https://github.com/Adhishtanaka/todo-app/pulls).


