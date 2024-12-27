import { Request, Response } from 'express';
import { writePrisma, readPrisma } from '../prisma';
import { handle500Response } from '../helpers';
import { COMPANY_ID } from '../constants';

const minimalDepartmentSelect = {
  id: true,
  name: true,
  description: true,
  locationId: true,
  companyId: true,
  createdAt: true,
  updatedAt: true,
};

export const getAllDepartments = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const take = limit + 1;

  try {
    const departments = await readPrisma.department.findMany({
      where: {
        deletedAt: null,
        companyId: COMPANY_ID,
      },
      select: minimalDepartmentSelect,
      skip: page * limit,
      take,
    });

    const next = departments.length > limit;
    if (next) {
      departments.pop();
    }

    res.status(200).json({ data: departments, next });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error occurred while fetching departments',
      'departmentController.getAllDepartments',
    );
  }
};

export const getDepartmentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);

  if (isNaN(idInt) || idInt < 1) {
    return res.status(400).json({ message: `Invalid department ID: ${id}` });
  }

  try {
    const department = await readPrisma.department.findUnique({
      where: {
        id: idInt,
        companyId: COMPANY_ID,
      },
      select: minimalDepartmentSelect,
    });

    if (!department) {
      return res
        .status(404)
        .json({ message: `Department with ID ${id} not found` });
    }

    return res.json(department);
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error fetching department with ID: ${id}`,
      'departmentController.getDepartmentById',
    );
  }
};

export const createDepartment = async (req: Request, res: Response) => {
  const { name, description, locationId } = req.body;

  try {
    const newDepartment = await writePrisma.department.create({
      data: {
        name,
        description,
        locationId: parseInt(locationId, 10),
        companyId: COMPANY_ID,
      },
      select: minimalDepartmentSelect,
    });

    res.status(201).json({
      message: `Department ${newDepartment.id} created successfully`,
      data: newDepartment,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error creating department`,
      'departmentController.createDepartment',
      JSON.stringify(req.body),
    );
  }
};

export const updateDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);

  if (isNaN(idInt) || idInt < 1) {
    return res.status(400).json({ message: `Invalid department ID: ${id}` });
  }

  const updateData = req.body;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, ...validData } = updateData;

  try {
    const updatedDepartment = await writePrisma.department.update({
      where: { id: idInt, companyId: COMPANY_ID },
      data: validData,
      select: minimalDepartmentSelect,
    });

    res.status(200).json({
      message: `Department ${id} updated successfully`,
      data: updatedDepartment,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error updating department with ID: ${id}`,
      'departmentController.updateDepartment',
      JSON.stringify(updateData),
    );
  }
};

export const DeleteDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);

  if (isNaN(idInt) || idInt < 1) {
    return res.status(400).json({ message: `Invalid department ID: ${id}` });
  }

  try {
    const deletedDepartment = await writePrisma.department.update({
      where: { id: idInt, companyId: COMPANY_ID },
      data: {
        deletedAt: new Date(),
      },
      select: minimalDepartmentSelect,
    });

    res.status(200).json({
      message: `Department ${id} soft-deleted successfully`,
      data: deletedDepartment,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error soft-deleting department with ID: ${id}`,
      'departmentController.softDeleteDepartment',
    );
  }
};

// userDepartmentControllers
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
          select: {
            userId: true,
            departmentId: true,
            active: true,
            updatedAt: true,
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
      where: { departmentId: parseInt(departmentId), active: true },
      include: {
        user: true,
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

export const getUsersCountForDepartment = async (
  req: Request,
  res: Response,
) => {
  const { departmentId } = req.params;

  try {
    const usersCount = await writePrisma.userDepartment.count({
      where: { departmentId: parseInt(departmentId), active: true },
    });

    res.status(200).json({
      message: `Users count for department ${departmentId}`,
      data: usersCount,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error fetching users count for department ${departmentId}`,
      'userDepartmentController.getUsersCountForDepartment',
      JSON.stringify(req.params),
    );
  }
};

export const deleteUserDepartment = async (req: Request, res: Response) => {
  const { userId, departmentId } = req.params;

  try {
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
