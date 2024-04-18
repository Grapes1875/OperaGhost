import mongoose from 'mongoose';

// Define the User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

// Define the Lobby schema
const lobbySchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdBy: { type: String, required: true } // Assuming createdBy is the user ID
});

// Create models from the schemas
const User = mongoose.model('User', userSchema);
const Lobby = mongoose.model('Lobby', lobbySchema);

export { User, Lobby };
