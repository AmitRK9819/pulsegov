import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { verifyToken } from '../utils/auth.util';

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { email, password, name, phone, department_code } = req.body;

            // Validation
            if (!email || !password || !name || !department_code) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields',
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

            const officer = await authService.registerOfficer({
                email,
                password,
                name,
                phone,
                department_code,
            });

            res.status(201).json({
                success: true,
                message: 'Officer registered successfully',
                officer,
            });
        } catch (error: any) {
            console.error('Registration error:', error);
            res.status(400).json({
                success: false,
                error: error.message || 'Registration failed',
            });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    error: 'Email and password are required',
                });
            }

            const result = await authService.loginOfficer({ email, password });

            res.json({
                success: true,
                message: 'Login successful',
                ...result,
            });
        } catch (error: any) {
            console.error('Login error:', error);
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

            const profile = await authService.getOfficerProfile(decoded.id);

            res.json({
                success: true,
                profile,
            });
        } catch (error: any) {
            console.error('Profile error:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to fetch profile',
            });
        }
    }

    async getDepartments(req: Request, res: Response) {
        try {
            const departments = await authService.getDepartments();

            res.json({
                success: true,
                departments,
            });
        } catch (error: any) {
            console.error('Departments error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch departments',
            });
        }
    }
}
