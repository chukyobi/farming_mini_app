import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userAuthRoutes';
import twitterRoutes from './routes/twitterAuthRoute';
import dashboardRoute from './routes/dashboardRoute';
import welcomeUser from './routes/userWelcomeRoute';
import updateUsername from './routes/updateUsernameRoute';
import gameValuesRoute from './routes/gameValuesRoute';
import migrationRoute from './routes/migrationRoute';
import questRoute from './routes/questRoutes';


dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: '*', // Allow all origins
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Change to true if using HTTPS
}));


// Routes
app.use("/auth", userRoutes);
app.use("/auth", twitterRoutes);
app.use("/welcome", welcomeUser);
app.use("/dashboard", dashboardRoute);
app.use('/updateUser', updateUsername);
app.use("/values",gameValuesRoute);
app.use("/migration",migrationRoute);
app.use("/quest", questRoute)

app.use('/assets', express.static(path.join(__dirname, 'src','assets')));

app.get("/", (req, res) => {
  res.redirect("/auth/authUser");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
