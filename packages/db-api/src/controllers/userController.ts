import { Request, Response } from 'express';
import { writePrisma, readPrisma } from '../prisma';
import { handle500Response } from '../helpers';
import { COMPANY_ID } from '../constants';

const minimalUserSelect = {
  id: true,
  email: true,
  role: true,
  firstName: true,
  lastName: true,
};

export const getAllUsers = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const take = limit + 1;

  try {
    const users = await readPrisma.user.findMany({
      where: {
        deletedAt: null,
      },
      select: minimalUserSelect,
      skip: page * limit,
      take,
    });

    const next = users.length > limit;
    if (next) {
      users.pop();
    }

    res.status(200).json({ data: users, next });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error occurred while fetching users',
      'userController.getAllUsers',
    );
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);

  if (isNaN(idInt) || idInt < 1) {
    return res.status(400).json({ message: `Invalid user ID: ${id}` });
  }

  try {
    const user = await readPrisma.user.findUnique({
      where: {
        id: idInt,
      },
      select: minimalUserSelect,
    });

    if (!user) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }

    return res.json(user);
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error fetching user with ID: ${id}`,
      'userController.getUserById',
    );
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { email, firstName, lastName, role, locationId, reportsToId } =
    req.body;

  try {
    const newUser = await writePrisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        role,
        locationId,
        reportsToId,
        companyId: COMPANY_ID,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    res.status(201).json({
      message: `User ${newUser.id} created successfully`,
      data: newUser,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error creating user`,
      'userController.createUser',
      JSON.stringify(req.body),
    );
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);

  if (isNaN(idInt) || idInt < 1) {
    return res.status(400).json({ message: `Invalid user ID: ${id}` });
  }

  const updateData = req.body;
  const { user, ...validData } = updateData;

  try {
    const updatedUser = await writePrisma.user.update({
      where: { id: idInt, companyId: COMPANY_ID },
      data: validData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    res
      .status(200)
      .json({ message: `User ${id} updated successfully`, data: updatedUser });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error updating user with ID: ${id}`,
      'userController.updateUser',
      JSON.stringify(updateData),
    );
  }
};

export const DeleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);

  if (isNaN(idInt) || idInt < 1) {
    return res.status(400).json({ message: `Invalid user ID: ${id}` });
  }

  try {
    const deletedUser = await writePrisma.user.update({
      where: { id: idInt, companyId: COMPANY_ID },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    res.status(200).json({
      message: `User ${id} soft-deleted successfully`,
      data: deletedUser,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error soft-deleting user with ID: ${id}`,
      'userController.softDeleteUser',
    );
  }
};
