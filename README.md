# 🏴‍☠️ FlagForge Backend

The backend service for **FlagForge**, a platform built to manage CTF-style challenges, user submissions, scoring, and authentication in a secure and scalable way.

## 🚀 Features

- 🔐 **User Authentication** - JWT-based secure authentication system
- 🏆 **Challenge & Flag Management** - Create, manage, and validate CTF challenges
- 📊 **Leaderboard & Score Tracking** - Real-time scoring and ranking system
- 📬 **Submission System** - Robust submission handling with validations
- 📡 **RESTful API** - Clean, documented API endpoints
- 🛡️ **Secure by Design** - Built with security best practices

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **JWT** - JSON Web Tokens for authentication
- **Docker** - Containerization (optional)

## 🧩 Project Structure

```
/flagforge-backend
│
├── src/
│   ├── config/         # Password hashing and database configurations
│   ├── controllers/     # Request handlers
│   ├── interfaces/     # Type definitions and interfaces  
│   ├── middlewares/     # Custom middleware functions
│   ├── models/         # Data models and schemas
│   ├── routes/         # API route definitions
│   └── utils/          # Helper functions and utilities
├── .env                # Environment variables
├── package.json        # Node.js dependencies and scripts
└── README.md          # Project documentation
```

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/FlagForgeCTF/flagforge-backend.git
cd flagforge-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory or just rename the .env.example to .env

### 4. Database Setup

#### MongoDB Setup
1. Install MongoDB on your system or use MongoDB Atlas (cloud)
2. Start MongoDB service
3. Create a new database named `flagforge` (will be created automatically on first connection)
4. Update the `MONGODB_URI` in your `.env` file

For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/flagforge?retryWrites=true&w=majority
```

#### Ensure ts-node is Installed
```bash
npm install -D ts-node
```

### 5. Start the server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server runs at: **http://localhost:3000**

## 📂 Deployment Options

FlagForge backend can be easily deployed using:

- **Docker** - Containerized deployment
- **Railway** - Easy deployment with automatic builds
- **Render** - Free tier available with PostgreSQL
- **Heroku** - Classic PaaS deployment
- **VPS** - Traditional server deployment
- **GitHub Actions** - CI/CD pipeline integration

### Environment Variables for Production

```env
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
NODE_ENV=production
PORT=5000
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Input Validation** - Comprehensive request validation
- **Rate Limiting** - Protection against brute force attacks
- **CORS Configuration** - Cross-origin request handling
- **NoSQL Injection Protection** - Proper input sanitization for MongoDB
- **Password Hashing** - Secure password storage with bcrypt

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📋 Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with hot reload
npm test           # Run test suite
npm run build      # Build for production
```

## 🐛 Troubleshooting

### Common Issues

**Database Connection Issues**
- Verify MongoDB is running
- Check MONGODB_URI format
- Ensure database connection is established
- For Atlas: Check network access and authentication

**JWT Authentication Errors**
- Verify JWT_SECRET is set
- Check token expiration
- Validate token format

**Port Already in Use**
- Change PORT in .env file
- Kill process using the port: `lsof -ti:3000 | xargs kill`

## 📄 License

This project is licensed under the **GPL-3.0 license**.

## 🙏 Acknowledgments

- Built with ❤️ for hackers, learners, and CTF enthusiasts
- Inspired by the cybersecurity community
- Special thanks to all contributors

---

**Happy Hacking! 🚀**

For questions, issues, or feature requests, please open an issue on GitHub.
