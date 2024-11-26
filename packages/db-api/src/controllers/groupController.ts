import { Request, Response } from 'express';
import { writePrisma, readPrisma } from '../prisma';
import { handle500Response } from '../helpers';
import { COMPANY_ID } from '../constants';

const minimalGroupSelect = {
  id: true,
  name: true,
  description: true,
  locationId: true,
  createdAt: true,
  updatedAt: true,
};

export const getAllGroups = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const take = limit + 1;

  try {
    const groups = await readPrisma.group.findMany({
      where: {
        companyId: COMPANY_ID,
        deletedAt: null,
      },
      select: minimalGroupSelect,
      skip: page * limit,
      take,
    });

    const next = groups.length > limit;
    if (next) {
      groups.pop();
    }

    res.status(200).json({ data: groups, next });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error occurred while fetching groups',
      'groupController.getAllGroups',
    );
  }
};

export const getGroupById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const group = await readPrisma.group.findUnique({
      where: {
        id: parseInt(id),
        companyId: COMPANY_ID,
        deletedAt: null,
      },
      select: minimalGroupSelect,
    });

    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    res.status(200).json({ data: group });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error occurred while fetching group',
      'groupController.getGroupById',
    );
  }
};

export const createGroup = async (req: Request, res: Response) => {
  const { name, description, locationId } = req.body;

  try {
    const group = await writePrisma.group.create({
      data: {
        name,
        description,
        locationId,
        companyId: COMPANY_ID,
      },
      select: minimalGroupSelect,
    });

    res.status(201).json({ data: group });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error creating group',
      'groupController.createGroup',
      JSON.stringify(req.body),
    );
  }
};

export const updateGroup = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, locationId } = req.body;

  try {
    const group = await writePrisma.group.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        locationId,
      },
      select: minimalGroupSelect,
    });

    res
      .status(200)
      .json({ message: 'Group successfully updated', data: group });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error updating group',
      'groupController.updateGroup',
      JSON.stringify(req.body),
    );
  }
};

export const deleteGroup = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const group = await writePrisma.group.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });

    res
      .status(200)
      .json({ message: 'Group successfully deleted', data: group });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error deleting group',
      'groupController.deleteGroup',
      JSON.stringify(req.params),
    );
  }
};
