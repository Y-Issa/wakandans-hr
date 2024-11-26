import { Request, Response } from 'express';
import { writePrisma, readPrisma } from '../prisma';
import { handle500Response } from '../helpers';
import { COMPANY_ID } from '../constants';

const minimalCompanyConfigurationSelect = {
  id: true,
  logo: true,
  description: true,
  website: true,
  createdAt: true,
  updatedAt: true,
};

export const getAllCompanyConfigurations = async (
  req: Request,
  res: Response,
) => {
  const page = parseInt(req.query.page as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const take = limit + 1;

  try {
    const configurations = await readPrisma.companyConfiguration.findMany({
      where: {
        companyId: COMPANY_ID,
        deletedAt: null,
      },
      select: minimalCompanyConfigurationSelect,
      skip: page * limit,
      take,
    });

    const next = configurations.length > limit;
    if (next) {
      configurations.pop();
    }

    res.status(200).json({ data: configurations, next });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error occurred while fetching company configurations',
      'companyConfigurationController.getAllCompanyConfigurations',
    );
  }
};

export const getCompanyConfigurationById = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;

  try {
    const configuration = await readPrisma.companyConfiguration.findUnique({
      where: {
        id: parseInt(id),
        companyId: COMPANY_ID,
        deletedAt: null,
      },
      select: minimalCompanyConfigurationSelect,
    });

    if (!configuration) {
      res.status(404).json({ message: 'Company Configuration not found' });
      return;
    }

    res.status(200).json({ data: configuration });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error occurred while fetching company configuration',
      'companyConfigurationController.getCompanyConfigurationById',
    );
  }
};

export const createCompanyConfiguration = async (
  req: Request,
  res: Response,
) => {
  const { logo, description, website } = req.body;

  try {
    const configuration = await writePrisma.companyConfiguration.create({
      data: {
        companyId: COMPANY_ID,
        logo,
        description,
        website,
      },
      select: minimalCompanyConfigurationSelect,
    });

    res.status(201).json({ data: configuration });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error creating company configuration',
      'companyConfigurationController.createCompanyConfiguration',
      JSON.stringify(req.body),
    );
  }
};

export const updateCompanyConfiguration = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;
  const { logo, description, website } = req.body;

  try {
    const configuration = await writePrisma.companyConfiguration.update({
      where: { id: parseInt(id) },
      data: {
        logo,
        description,
        website,
      },
      select: minimalCompanyConfigurationSelect,
    });

    res.status(200).json({
      message: 'Company Configuration successfully updated',
      data: configuration,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error updating company configuration',
      'companyConfigurationController.updateCompanyConfiguration',
      JSON.stringify(req.body),
    );
  }
};

export const deleteCompanyConfiguration = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params;

  try {
    const configuration = await writePrisma.companyConfiguration.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });

    res.status(200).json({
      message: 'Company Configuration successfully deleted',
      data: configuration,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error deleting company configuration',
      'companyConfigurationController.deleteCompanyConfiguration',
      JSON.stringify(req.params),
    );
  }
};
