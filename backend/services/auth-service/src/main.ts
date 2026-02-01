import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AuthController } from './controllers/auth.controller';
import { CitizenAuthController } from './controllers/citizen-auth.controller';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(express.json());

// Controllers
const authController = new AuthController();
const citizenAuthController = new CitizenAuthController();

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'auth-service' });
});

// Officer Auth routes
app.post('/api/auth/officer/register', authController.register.bind(authController));
app.post('/api/auth/officer/login', authController.login.bind(authController));
app.get('/api/auth/officer/profile', authController.getProfile.bind(authController));
app.get('/api/auth/departments', authController.getDepartments.bind(authController));

// Citizen Auth routes
app.post('/api/auth/citizen/register', citizenAuthController.register.bind(citizenAuthController));
app.post('/api/auth/citizen/login', citizenAuthController.login.bind(citizenAuthController));
app.get('/api/auth/citizen/profile', citizenAuthController.getProfile.bind(citizenAuthController));
app.get('/api/auth/citizen/check-username/:username', citizenAuthController.checkUsername.bind(citizenAuthController));

// Start server
app.listen(PORT, () => {
    console.log(`🔐 Auth Service running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
