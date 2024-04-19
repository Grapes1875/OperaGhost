import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { StreamChat } from 'stream-chat';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Allow requests from all origins
app.use(cors());

app.use(express.json());

const api_key = "tnr699vt7egz";
const api_secret = "v9dpmacpxr55pr32j64c7ne8hnr88nzea4cw9yhfsu2t46ymye5yyf3hka6rvhza";

const serverClient = StreamChat.getInstance(api_key, api_secret);

// Endpoint to create a lobby
app.post("/create-lobby", async (req, res) => {
    try {
        const { userId, lobbyName } = req.body;

        // Create a new channel
        const channel = serverClient.channel('messaging', uuidv4(), {
            name: lobbyName,
            created_by_id: userId,
        });

        // Add creator as a member of the channel
        await channel.create();

        res.json({ channel });
    } catch (error) {
        console.error("Error creating lobby:", error);
        res.status(500).json({ message: "Failed to create lobby" });
    }
});

// Endpoint for user sign-up
app.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;
        const userId = uuidv4(); 
        const hashedPassword = await bcrypt.hash(password, 10);

        // Set user's role to 'user' during user creation
        const { users } = await serverClient.upsertUsers([
            {
                id: userId,
                name: username,
                role: 'user',
                hashedPassword: hashedPassword
            }
        ]);

        if (users.length === 0) {
            res.status(500).json({ message: "Failed to create user" });
            return;
        }

        const token = serverClient.createToken(userId);

        res.json({ token, username, userId, hashedPassword });
    } catch (error) {
        console.error("Error signing up:", error);
        res.status(500).json({ message: "Failed to sign up" });
    }
});

// Endpoint for user login
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const { users } = await serverClient.queryUsers({ name: username });
        if (users.length === 0)
            return res.json({ message: "User not found" });

        const token = serverClient.createToken(users[0].id);
        const passwordMatch = await bcrypt.compare(password, users[0].hashedPassword);

        if (passwordMatch) {
            res.json({
                token,
                username,
                userId: users[0].id
            });
        } else {
            res.status(401).json({ message: "Incorrect password" });
        }
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Failed to log in" });
    }
});

app.listen(5000, () => {
    console.log('Server started on PORT 5000');
});
