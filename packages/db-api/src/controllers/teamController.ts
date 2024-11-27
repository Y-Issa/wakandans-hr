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
    const team = await readPrisma.team.findFirst({
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

// userTeamControllers
export const assignUserTeam = async (req: Request, res: Response) => {
  const { userId, teamId, active = true } = req.body;

  if (!userId || !teamId) {
    return res.status(400).json({ message: 'userId and teamId are required' });
  }

  try {
    const existingUserTeam = await writePrisma.userTeam.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
    });

    let result;

    if (existingUserTeam) {
      if (!existingUserTeam.active) {
        result = await writePrisma.userTeam.update({
          where: {
            userId_teamId: {
              userId,
              teamId,
            },
          },
          data: {
            active: true,
            updatedAt: new Date(),
          },
        });

        return res.status(200).json({
          message: 'User successfully reassigned to team',
          data: result,
        });
      } else {
        return res.status(409).json({
          message: 'User is already assigned to this team',
        });
      }
    } else {
      result = await writePrisma.userTeam.create({
        data: {
          userId,
          teamId,
          active,
        },
      });

      return res.status(201).json({
        message: 'User successfully assigned to team',
        data: result,
      });
    }
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error assigning user to team',
      'userTeamController.assignUserTeam',
      JSON.stringify(req.body),
    );
  }
};

export const getTeamsForUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const userTeams = await readPrisma.userTeam.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        team: true,
      },
    });

    res.status(200).json({
      message: `Teams for user ${userId}`,
      data: userTeams,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error getting teams for user',
      'userTeamController.getTeamsForUser',
      JSON.stringify(req.params),
    );
  }
};

export const getUsersForTeam = async (req: Request, res: Response) => {
  const { teamId } = req.params;

  try {
    const teamUsers = await readPrisma.userTeam.findMany({
      where: {
        teamId: parseInt(teamId),
      },
      include: {
        user: true,
      },
    });

    res.status(200).json({
      message: `Users for team ${teamId}`,
      data: teamUsers,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error getting users for team',
      'userTeamController.getUsersForTeam',
      JSON.stringify(req.params),
    );
  }
};

export const deleteUserTeam = async (req: Request, res: Response) => {
  const { userId, teamId } = req.params;

  try {
    const result = await writePrisma.userTeam.update({
      where: {
        userId_teamId: {
          userId: parseInt(userId),
          teamId: parseInt(teamId),
        },
      },
      data: {
        active: false,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({
      message: 'User successfully removed from team',
      data: result,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error deleting user from team',
      'userTeamController.deleteUserTeam',
      JSON.stringify(req.params),
    );
  }
};
