
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check whether username and password were provided
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    // Find the login account
    const userLogin = await prisma.userLogin.findUnique({
      where: {
        username,
      },
      include: {
        employee: {
          include: {
            role: true,
          },
        },
      },
    });

    // Check username
    if (!userLogin) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // Check whether login account is active
    if (!userLogin.isActive) {
      return res.status(403).json({
        message: "User account is inactive",
      });
    }

    // Check whether employee is active
    if (!userLogin.employee.isActive) {
      return res.status(403).json({
        message: "Employee account is inactive",
      });
    }

    // Compare entered password with stored password hash
    const passwordMatch = await bcrypt.compare(
      password,
      userLogin.passwordHash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // JWT secret
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({
        message: "JWT_SECRET is not configured",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: userLogin.id,
        employeeId: userLogin.employee.id,
        role: userLogin.employee.role.name,
      },
      jwtSecret,
      {
        expiresIn: "1d",
      }
    );

    // Update last login time
    await prisma.userLogin.update({
      where: {
        id: userLogin.id,
      },
      data: {
        lastLogin: new Date(),
      },
    });

    // Send response
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: userLogin.employee.id,
        name: userLogin.employee.name,
        username: userLogin.username,
        role: userLogin.employee.role.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

