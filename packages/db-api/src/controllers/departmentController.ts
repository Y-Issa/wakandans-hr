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
        locationId,
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
  console.log(updateData);
  const { user, ...validData } = updateData;

  try {
    const updatedDepartment = await writePrisma.department.update({
      where: { id: idInt, companyId: COMPANY_ID },
      data: { ...validData, updatedAt: new Date() },
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

export const softDeleteDepartment = async (req: Request, res: Response) => {
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
