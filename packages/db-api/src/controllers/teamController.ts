import { Request, Response } from 'express';
import { writePrisma, readPrisma } from '../prisma';
import { handle500Response } from '../helpers';
import { COMPANY_ID } from '../constants';

const minimalTeamSelect = {
  id: true,
  name: true,
  description: true,
  locationId: true,
  createdAt: true,
  updatedAt: true,
};

export const getAllTeams = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const take = limit + 1;

  try {
    const teams = await readPrisma.team.findMany({
      where: {
        companyId: COMPANY_ID,
        deletedAt: null,
      },
      select: minimalTeamSelect,
      skip: page * limit,
      take,
    });

    const next = teams.length > limit;
    if (next) {
      teams.pop();
    }

    res.status(200).json({ data: teams, next });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error occurred while fetching teams',
      'teamController.getAllTeams',
    );
  }
};

export const getTeamById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const team = await readPrisma.team.findUnique({
      where: {
        id: parseInt(id),
        companyId: COMPANY_ID,
        deletedAt: null,
      },
      select: minimalTeamSelect,
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.status(200).json({ data: team });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error fetching team',
      'teamController.getTeamById',
      JSON.stringify(req.params),
    );
  }
};

export const createTeam = async (req: Request, res: Response) => {
  const { name, description, locationId } = req.body;

  if (!name || !description) {
    return res
      .status(400)
      .json({ message: 'Name and description are required' });
  }

  try {
    const newTeam = await writePrisma.team.create({
      data: {
        name,
        description,
        locationId: locationId || null,
        companyId: COMPANY_ID,
      },
    });

    res.status(201).json({
      message: 'Team successfully created',
      data: newTeam,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error creating team',
      'teamController.createTeam',
      JSON.stringify(req.body),
    );
  }
};

export const updateTeam = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, locationId } = req.body;

  try {
    const updatedTeam = await writePrisma.team.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        locationId: locationId || null,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({
      message: 'Team successfully updated',
      data: updatedTeam,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error updating team',
      'teamController.updateTeam',
      JSON.stringify(req.params),
    );
  }
};

export const deleteTeam = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await writePrisma.team.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });

    res.status(200).json({ message: 'Team successfully deleted' });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error deleting team',
      'teamController.deleteTeam',
      JSON.stringify(req.params),
    );
  }
};
