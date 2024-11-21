import { Request, Response } from 'express';
import { writePrisma } from '../prisma';
import { handle500Response } from '../helpers';

export const assignUserDepartment = async (req: Request, res: Response) => {
  const { userId, departmentId, active = true } = req.body;

  if (!userId || !departmentId) {
    return res
      .status(400)
      .json({ message: 'userId and departmentId are required' });
  }

  try {
    const existingUserDepartment = await writePrisma.userDepartment.findUnique({
      where: {
        userId_departmentId: {
          userId,
          departmentId,
        },
      },
    });

    let result;

    if (existingUserDepartment) {
      if (!existingUserDepartment.active) {
        result = await writePrisma.userDepartment.update({
          where: {
            userId_departmentId: {
              userId,
              departmentId,
            },
          },
          data: {
            active: true,
            updatedAt: new Date(),
          },
        });

        return res.status(200).json({
          message: 'User successfully reassigned to department',
          data: result,
        });
      } else {
        return res.status(409).json({
          message: 'User is already assigned to this department',
        });
      }
    } else {
      result = await writePrisma.userDepartment.create({
        data: {
          userId,
          departmentId,
          active,
        },
      });

      return res.status(201).json({
        message: 'User successfully assigned to department',
        data: result,
      });
    }
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error assigning user to department',
      'userDepartmentController.assignUserDepartment',
      JSON.stringify(req.body),
    );
  }
};

export const getDepartmentsForUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const userDepartments = await writePrisma.userDepartment.findMany({
      where: { userId: parseInt(userId) },
      include: {
        department: true,
      },
    });

    res.status(200).json({
      message: `Departments for user ${userId}`,
      data: userDepartments,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error fetching departments for user ${userId}`,
      'userDepartmentController.getDepartmentsForUser',
      JSON.stringify(req.params),
    );
  }
};

export const getUsersForDepartment = async (req: Request, res: Response) => {
  const { departmentId } = req.params;

  try {
    const departmentUsers = await writePrisma.userDepartment.findMany({
      where: { departmentId: parseInt(departmentId) },
      include: {
        user: true, // Include related user details
      },
    });

    res.status(200).json({
      message: `Users for department ${departmentId}`,
      data: departmentUsers,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error fetching users for department ${departmentId}`,
      'userDepartmentController.getUsersForDepartment',
      JSON.stringify(req.params),
    );
  }
};

export const deleteUserDepartment = async (req: Request, res: Response) => {
  const { userId, departmentId } = req.params;

  try {
    // Perform a soft delete by updating the 'active' field to false
    const updatedUserDepartment = await writePrisma.userDepartment.update({
      where: {
        userId_departmentId: {
          userId: parseInt(userId),
          departmentId: parseInt(departmentId),
        },
      },
      data: {
        active: false,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({
      message: `User removed from department successfully`,
      data: updatedUserDepartment,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error removing user from department`,
      'userDepartmentController.deleteUserDepartment',
      JSON.stringify(req.params),
    );
  }
};
