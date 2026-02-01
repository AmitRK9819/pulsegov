import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { verifyToken } from '../utils/auth.util';

const authService = new AuthService();

export class CitizenAuthController {
    async register(req: Request, res: Response) {
        try {
            const { username, email, password } = req.body;

            // Validation
            if (!username || !email || !password) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields: username, email, password',
                });
            }

            // Username validation (alphanumeric and underscore only)
            const usernameRegex = /^[a-zA-Z0-9_]+$/;
            if (!usernameRegex.test(username)) {
                return res.status(400).json({
                    success: false,
                    error: 'Username can only contain letters, numbers, and underscores',
                });
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid email format',
                });
            }

            // Password validation (min 6 characters)
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    error: 'Password must be at least 6 characters',
                });
            }

            const citizen = await authService.registerCitizen({
                username,
                email,
                password,
            });

            res.status(201).json({
                success: true,
                message: 'Citizen registered successfully',
                citizen,
            });
        } catch (error: any) {
            console.error('Citizen registration error:', error);
            res.status(400).json({
                success: false,
                error: error.message || 'Registration failed',
            });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    error: 'Username and password are required',
                });
            }

            const result = await authService.loginCitizen({ username, password });

            res.json({
                success: true,
                message: 'Login successful',
                ...result,
            });
        } catch (error: any) {
            console.error('Citizen login error:', error);
            res.status(401).json({
                success: false,
                error: error.message || 'Login failed',
            });
        }
    }

    async getProfile(req: Request, res: Response) {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    success: false,
                    error: 'No token provided',
                });
            }

            const token = authHeader.substring(7);
            const decoded = verifyToken(token);

            if (!decoded) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid or expired token',
                });
            }

            const profile = await authService.getCitizenProfile(decoded.id);

            res.json({
                success: true,
                profile,
            });
        } catch (error: any) {
            console.error('Citizen profile error:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch profile',
            });
        }
    }

    async checkUsername(req: Request, res: Response) {
        try {
            const { username } = req.params;

            if (!username) {
                return res.status(400).json({
                    success: false,
                    error: 'Username is required',
                });
            }

            const isAvailable = await authService.checkUsernameAvailability(username);

            res.json({
                success: true,
                available: isAvailable,
            });
        } catch (error: any) {
            console.error('Username check error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to check username availability',
            });
        }
    }
}
