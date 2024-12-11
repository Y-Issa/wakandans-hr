import { Request, Response } from 'express';
import { writePrisma, readPrisma } from '../prisma';
import { handle500Response } from '../helpers';

const minimalWorkSettingSelect = {
  id: true,
  remoteWorkAllowed: true,
  hybridWorkAllowed: true,
  inOfficeAvailable: true,
  flexibleHours: true,
  partTime: true,
  timeZone: true,
  workingSchedule: true,
  maxDaysOffPerYear: true,
  maxOooMinsPerDay: true,
  pdAllowancePerYear: true,
};

export const getAllWorkSettings = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const take = limit + 1;

  try {
    const workSettings = await readPrisma.workSetting.findMany({
      where: { deletedAt: null },
      select: minimalWorkSettingSelect,
      skip: page * limit,
      take,
    });

    const next = workSettings.length > limit;
    if (next) {
      workSettings.pop();
    }

    res.status(200).json({ data: workSettings, next });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error occurred while fetching work settings',
      'workSettingController.getAllWorkSettings',
    );
  }
};

export const getWorkSettingById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const workSetting = await readPrisma.workSetting.findUnique({
      where: { id: parseInt(id, 10) },
      select: minimalWorkSettingSelect,
    });

    if (!workSetting) {
      res.status(404).json({ message: 'Work Setting not found' });
      return;
    }

    res.status(200).json({ data: workSetting });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error occurred while fetching work setting',
      'workSettingController.getWorkSettingById',
    );
  }
};

export const createWorkSetting = async (req: Request, res: Response) => {
  const {
    remoteWorkAllowed,
    hybridWorkAllowed,
    inOfficeAvailable,
    flexibleHours,
    partTime,
    timeZone,
    workingSchedule,
    maxDaysOffPerYear,
    maxOooMinsPerDay,
    pdAllowancePerYear,
  } = req.body;

  try {
    const workSetting = await writePrisma.workSetting.create({
      data: {
        remoteWorkAllowed,
        hybridWorkAllowed,
        inOfficeAvailable,
        flexibleHours,
        partTime,
        timeZone,
        workingSchedule,
        maxDaysOffPerYear,
        maxOooMinsPerDay,
        pdAllowancePerYear,
      },
      select: minimalWorkSettingSelect,
    });

    res.status(201).json({ data: workSetting });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error creating work setting',
      'workSettingController.createWorkSetting',
      JSON.stringify(req.body),
    );
  }
};

export const updateWorkSetting = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    remoteWorkAllowed,
    hybridWorkAllowed,
    inOfficeAvailable,
    flexibleHours,
    partTime,
    timeZone,
    workingSchedule,
    maxDaysOffPerYear,
    maxOooMinsPerDay,
    pdAllowancePerYear,
  } = req.body;

  try {
    const existingWorkSetting = await readPrisma.workSetting.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!existingWorkSetting || existingWorkSetting.deletedAt) {
      res.status(404).json({ message: 'Work Setting not found' });
      return;
    }

    const workSetting = await writePrisma.workSetting.update({
      where: { id: parseInt(id, 10) },
      data: {
        remoteWorkAllowed,
        hybridWorkAllowed,
        inOfficeAvailable,
        flexibleHours,
        partTime,
        timeZone,
        workingSchedule,
        maxDaysOffPerYear,
        maxOooMinsPerDay,
        pdAllowancePerYear,
      },
      select: minimalWorkSettingSelect,
    });

    res.status(200).json({
      message: 'Work Setting successfully updated',
      data: workSetting,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error updating work setting',
      'workSettingController.updateWorkSetting',
      JSON.stringify(req.body),
    );
  }
};

export const deleteWorkSetting = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const existingWorkSetting = await readPrisma.workSetting.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!existingWorkSetting || existingWorkSetting.deletedAt) {
      res.status(404).json({ message: 'Work Setting not found' });
      return;
    }

    const workSetting = await writePrisma.workSetting.update({
      where: { id: parseInt(id, 10) },
      data: { deletedAt: new Date() },
    });

    res.status(200).json({
      message: 'Work Setting successfully deleted',
      data: workSetting,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error deleting work setting',
      'workSettingController.deleteWorkSetting',
    );
  }
};
