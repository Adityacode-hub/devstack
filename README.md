# DevStack

DevStack is a modern developer Q&A and knowledge-sharing platform built with the MERN stack.

It allows developers to ask technical questions, share answers, vote on useful content, discover discussions through tags, and maintain a developer profile with reputation and activity.

The project focuses on clean REST APIs, JWT authentication, reusable React components, responsive UI, MongoDB data modeling, and practical full-stack development.

---

## 🚀 Features

### Authentication
- User registration and login
- JWT-based authentication
- Protected routes
- Persistent authentication session
- Secure password hashing using bcrypt

### Questions
- Create technical questions
- Edit and delete your own questions
- View questions
- Search questions
- Filter questions using tags
- Pagination
- Question view tracking
- Upvote and downvote questions

### Answers
- Post answers to questions
- Edit and delete your own answers
- Upvote and downvote answers
- Accept an answer
- Display accepted answers
- Validation for question and answer relationships

### Developer Profiles
- View developer profile
- Display reputation
- Display question and answer activity
- Display accepted answer statistics
- Update profile information
- Add languages
- Add work experience
- Add social links
- Add portfolio and website

### Tags
- Discover available tags
- Display question count for each tag
- Search tags
- Filter questions by tag

### UI / UX
- Responsive design
- Modern developer-focused interface
- Reusable React components
- Loading states
- Error states
- Empty states
- Protected navigation
- Responsive sidebar and navigation
- Clean dashboard experience

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- Lucide React
- Axios

### Backend

- Node.js
- Express.js
- REST API
- JWT
- bcryptjs
- CORS

### Database

- MongoDB
- Mongoose

### Development Tools

- Git
- GitHub
- VS Code
- Kiro
- npm

---

## 📁 Project Structure

```text
DevStack/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── README.md
├── .gitignore
├── package.json
└── package-lock.json