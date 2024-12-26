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
  profile: true,
  locationId: true,
  reportsToId: true,
};

export const getAllUsers = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const take = limit + 1;

  const sortField = (req.query.sortField as string) || 'role';
  const sortOrder = (req.query.sortOrder as string) || 'asc';

  try {
    const users = await readPrisma.user.findMany({
      where: {
        deletedAt: null,
      },
      select: minimalUserSelect,
      skip: page * limit,
      take,
      orderBy: [{ [sortField]: sortOrder }, { firstName: 'asc' }],
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

export const getAllManagers = async (_req: Request, res: Response) => {
  try {
    const managers = await readPrisma.user.findMany({
      where: {
        deletedAt: null,
        role: { in: ['MANAGER', 'ADMIN'] },
      },
      select: minimalUserSelect,
    });

    res.status(200).json({ data: managers });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error occurred while fetching managers',
      'userController.getAllManagers',
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
      select: { ...minimalUserSelect, location: true },
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
  const { email, firstName, lastName, role, locationId, reportsToId, profile } =
    req.body;
  const locationIdInt = parseInt(locationId, 10);
  const reportsToIdInt =
    typeof reportsToId === 'string' && reportsToId.length > 0
      ? parseInt(reportsToId, 10)
      : null;

  try {
    // Check if the user already exists
    const existingUser = await writePrisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (existingUser) {
      if (existingUser.deletedAt) {
        // Reactivate the user
        const reactivatedUser = await writePrisma.user.update({
          where: { id: existingUser.id },
          data: {
            deletedAt: null,
            firstName,
            lastName,
            role,
            locationId: locationIdInt,
            reportsToId: reportsToIdInt,
            profile: existingUser.profile
              ? undefined // Keep the existing profile if it exists
              : {
                  create: {
                    title: profile?.title,
                    employedAt: null,
                    dateOfBirth: null,
                    profileImage: null,
                  },
                },
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            profile: {
              select: {
                id: true,
              },
            },
          },
        });

        return res.status(200).json({
          message: `User ${reactivatedUser.id} reactivated successfully with Profile ${reactivatedUser.profile?.id}`,
          data: reactivatedUser,
        });
      }

      return res.status(409).json({
        message: `User with email ${email} already exists.`,
        data: existingUser,
      });
    }

    // Create a new user and profile
    const newUser = await writePrisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        role,
        locationId: locationIdInt,
        reportsToId: reportsToIdInt,
        companyId: COMPANY_ID,
        profile: {
          create: {
            title: profile?.title,
            employedAt: new Date(),
            dateOfBirth: null,
            profileImage: null,
          },
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        profile: {
          select: {
            id: true,
          },
        },
      },
    });

    res.status(201).json({
      message: `User ${newUser.id} created successfully with Profile ${newUser.profile?.id}`,
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
  const { firstName, lastName, email, role, locationId, reportsToId, profile } =
    updateData;

  try {
    const updatedUser = await writePrisma.user.update({
      where: { id: idInt, companyId: COMPANY_ID },
      data: {
        firstName,
        lastName,
        email,
        role,
        locationId: parseInt(locationId, 10),
        reportsToId: parseInt(reportsToId, 10),
        profile: {
          update: {
            title: profile?.title,
            employedAt: profile?.employedAt,
            dateOfBirth: profile?.dateOfBirth,
            profileImage: profile?.profileImage,
            additionalInfo: profile?.additionalInfo,
          },
        },
      },
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
    await writePrisma.profile.updateMany({
      where: { userId: idInt },
      data: {
        employedAt: null,
        dateOfBirth: null,
        profileImage: null,
        additionalInfo: {},
      },
    });

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

    return res.status(200).json({
      message: `User ${id} soft-deleted successfully`,
      data: deletedUser,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error soft-deleting user with ID: ${id}`,
      'userController.DeleteUser',
    );
  }
};
