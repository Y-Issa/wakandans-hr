import { Request, Response } from 'express';
import { writePrisma, readPrisma } from '../prisma';
import { handle500Response } from '../helpers';

const minimalDayOffSelect = {
  id: true,
  name: true,
  fromDate: true,
  toDate: true,
  createdAt: true,
  updatedAt: true,
};

export const getAllDayOffs = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const take = limit + 1;

  try {
    const dayOffs = await readPrisma.dayOff.findMany({
      where: {
        deletedAt: null,
      },
      select: minimalDayOffSelect,
      skip: page * limit,
      take,
    });

    const next = dayOffs.length > limit;
    if (next) {
      dayOffs.pop();
    }

    res.status(200).json({ data: dayOffs, next });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error occurred while fetching day offs',
      'dayOffController.getAllDayOffs',
    );
  }
};

export const getDayOffById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const dayOff = await readPrisma.dayOff.findUnique({
      where: {
        id: parseInt(id),
        deletedAt: null,
      },
      select: minimalDayOffSelect,
    });

    if (!dayOff) {
      res.status(404).json({ message: 'Day off not found' });
      return;
    }

    res.status(200).json({ data: dayOff });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error occurred while fetching day off',
      'dayOffController.getDayOffById',
    );
  }
};

export const createDayOff = async (req: Request, res: Response) => {
  const { name, fromDate, toDate } = req.body;

  try {
    const dayOff = await writePrisma.dayOff.create({
      data: {
        name,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
      },
      select: minimalDayOffSelect,
    });

    res.status(201).json({ data: dayOff });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error creating day off',
      'dayOffController.createDayOff',
      JSON.stringify(req.body),
    );
  }
};

export const updateDayOff = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, fromDate, toDate } = req.body;

  try {
    const dayOff = await writePrisma.dayOff.update({
      where: { id: parseInt(id) },
      data: {
        name,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
      },
      select: minimalDayOffSelect,
    });

    res
      .status(200)
      .json({ message: 'Day off successfully updated', data: dayOff });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error updating day off',
      'dayOffController.updateDayOff',
      JSON.stringify(req.body),
    );
  }
};

export const deleteDayOff = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const dayOff = await writePrisma.dayOff.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });

    res
      .status(200)
      .json({ message: 'Day off successfully deleted', data: dayOff });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error deleting day off',
      'dayOffController.deleteDayOff',
      JSON.stringify(req.params),
    );
  }
};
