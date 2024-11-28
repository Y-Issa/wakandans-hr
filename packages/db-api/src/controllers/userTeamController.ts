import { Request, Response } from 'express';
import { writePrisma, readPrisma } from '../prisma';
import { handle500Response } from '../helpers';

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
