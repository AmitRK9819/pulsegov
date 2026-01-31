import { Pool } from 'pg';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.util';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export interface RegisterOfficerDto {
    email: string;
    password: string;
    name: string;
    phone: string;
    department_code: string;
}

export interface LoginOfficerDto {
    email: string;
    password: string;
}

export class AuthService {
    async registerOfficer(dto: RegisterOfficerDto) {
        // Check if email already exists
        const existingOfficer = await pool.query(
            'SELECT id FROM officer_auth WHERE email = $1',
            [dto.email]
        );

        if (existingOfficer.rows.length > 0) {
            throw new Error('Email already registered');
        }

        // Validate department code
        const department = await pool.query(
            'SELECT id FROM departments WHERE code = $1',
            [dto.department_code]
        );

        if (department.rows.length === 0) {
            throw new Error('Invalid department code');
        }

        // Hash password
        const passwordHash = await hashPassword(dto.password);

        // Insert officer
        const result = await pool.query(
            `INSERT INTO officer_auth (email, password_hash, name, phone, department_code)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, email, name, phone, department_code, created_at`,
            [dto.email, passwordHash, dto.name, dto.phone, dto.department_code]
        );

        return result.rows[0];
    }

    async loginOfficer(dto: LoginOfficerDto) {
        // Find officer by email
        const result = await pool.query(
            `SELECT oa.*, d.name as department_name 
             FROM officer_auth oa
             JOIN departments d ON d.code = oa.department_code
             WHERE oa.email = $1`,
            [dto.email]
        );

        if (result.rows.length === 0) {
            throw new Error('Invalid credentials');
        }

        const officer = result.rows[0];

        // Verify password
        const isPasswordValid = await comparePassword(dto.password, officer.password_hash);

        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        // Generate JWT token
        const token = generateToken({
            id: officer.id,
            email: officer.email,
            name: officer.name,
            department_code: officer.department_code,
            department_name: officer.department_name,
        });

        // Return officer data without password
        const { password_hash, ...officerData } = officer;

        return {
            officer: officerData,
            token,
        };
    }

    async getOfficerProfile(officerId: number) {
        const result = await pool.query(
            `SELECT oa.id, oa.email, oa.name, oa.phone, oa.department_code, 
                    d.name as department_name, oa.created_at
             FROM officer_auth oa
             JOIN departments d ON d.code = oa.department_code
             WHERE oa.id = $1`,
            [officerId]
        );

        if (result.rows.length === 0) {
            throw new Error('Officer not found');
        }

        return result.rows[0];
    }

    async getDepartments() {
        const result = await pool.query(
            'SELECT id, name, code, description FROM departments ORDER BY name'
        );
        return result.rows;
    }
}
