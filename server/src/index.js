import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs'; 
import mongoose from 'mongoose'; 
import { fileURLToPath } from 'url';
import path from 'path';
import { StreamChat } from 'stream-chat'; // Import StreamChat

// Import schemas
import { User, Lobby } from './schemas.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://192.168.1.174:3000",
        "https://grapes1875.github.io/OperaGhost/",
        "https://opera-ghost-frontend-knrzro7zh-grapes1875s-projects.vercel.app",
        "https://opera-ghost-frontend.vercel.app",
        "https://opera-ghost-frontend-184x90nj3-grapes1875s-projects.vercel.app" 
    ]
}));

const MONGODB_URI = "mongodb+srv://Guest:Guest12345@cluster0.uv5hqma.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const api_key = "tnr699vt7egz";
const api_secret = "v9dpmacpxr55pr32j64c7ne8hnr88nzea4cw9yhfsu2t46ymye5yyf3hka6rvhza";

const serverClient = StreamChat.getInstance(api_key, api_secret); // Create StreamChat instance

app.get("/", (req, res) => {
    res.json("Hello");
});

// Endpoint to create a lobby
app.post("/create-lobby", async (req, res) => {
    try {
        const { userId, lobbyName } = req.body;

        // Create a new lobby document
        const lobby = new Lobby({
            name: lobbyName,
            createdBy: userId
        });

        // Save the lobby document to the database
        await lobby.save();

        res.json({ lobby });
    } catch (error) {
        console.error("Error creating lobby:", error);
        res.status(500).json({ message: "Failed to create lobby" });
    }
});

// Endpoint for user sign-up
app.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

    
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user document
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        // Save the user document to the database
        await user.save();

        res.json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error signing up:", error);
        res.status(500).json({ message: "Failed to sign up" });
    }
});

// Endpoint for user login
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            res.json({ message: "Login successful" });
        } else {
            res.status(401).json({ message: "Incorrect password" });
        }
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Failed to log in" });
    }
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
