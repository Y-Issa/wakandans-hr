import { Request, Response } from 'express';
import { writePrisma, readPrisma } from '../prisma';
import { handle500Response } from '../helpers';

export const assignUserGroup = async (req: Request, res: Response) => {
  const { userId, groupId, active = true } = req.body;

  if (!userId || !groupId) {
    return res.status(400).json({ message: 'userId and groupId are required' });
  }

  try {
    const existingUserGroup = await writePrisma.userGroup.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });

    let result;

    if (existingUserGroup) {
      if (!existingUserGroup.active) {
        result = await writePrisma.userGroup.update({
          where: {
            userId_groupId: {
              userId,
              groupId,
            },
          },
          data: {
            active: true,
            updatedAt: new Date(),
          },
        });

        return res.status(200).json({
          message: 'User successfully reassigned to group',
          data: result,
        });
      } else {
        return res.status(409).json({
          message: 'User is already assigned to this group',
        });
      }
    } else {
      result = await writePrisma.userGroup.create({
        data: {
          userId,
          groupId,
          active,
        },
      });

      return res.status(201).json({
        message: 'User successfully assigned to group',
        data: result,
      });
    }
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error assigning user to group',
      JSON.stringify({ userId, groupId }),
    );
  }
};

export const getGroupsForUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  try {
    const userGroups = await readPrisma.userGroup.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        group: true,
      },
    });

    return res.status(200).json({
      message: 'User groups retrieved',
      data: userGroups,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error retrieving user groups',
      JSON.stringify(req.params),
    );
  }
};

export const getUsersForGroup = async (req: Request, res: Response) => {
  const { groupId } = req.params;

  if (!groupId) {
    return res.status(400).json({ message: 'groupId is required' });
  }

  try {
    const groupUsers = await readPrisma.userGroup.findMany({
      where: {
        groupId: parseInt(groupId),
      },
      include: {
        user: true,
      },
    });

    return res.status(200).json({
      message: 'Group users retrieved',
      data: groupUsers,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error retrieving group users',
      JSON.stringify(req.params),
    );
  }
};

export const deleteUserGroup = async (req: Request, res: Response) => {
  const { userId, groupId } = req.params;

  if (!userId || !groupId) {
    return res.status(400).json({ message: 'userId and groupId are required' });
  }

  try {
    const userGroup = await writePrisma.userGroup.update({
      where: {
        userId_groupId: {
          userId: parseInt(userId),
          groupId: parseInt(groupId),
        },
      },
      data: {
        active: false,
        updatedAt: new Date(),
      },
    });

    return res.status(200).json({
      message: 'User group successfully deleted',
      data: userGroup,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error deleting user group',
      JSON.stringify(req.params),
    );
  }
};
