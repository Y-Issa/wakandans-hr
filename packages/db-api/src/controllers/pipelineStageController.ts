// src/controllers/pipelineStageController.ts
import { Request, Response } from 'express';
import { writePrisma, readPrisma } from '../prisma';
import { handle500Response } from '../helpers';

// Get all pipeline stages ordered by their sequence
export const getAllStages = async (req: Request, res: Response) => {
  console.log(req);
  try {
    const stages = await readPrisma.pipelineStage.findMany({
      orderBy: {
        order: 'asc',
      },
      include: {
        _count: {
          select: { candidates: true },
        },
      },
    });

    res.status(200).json({ data: stages });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error occurred while fetching pipeline stages',
      'pipelineStageController.getAllStages',
    );
  }
};

// Get details of a specific stage
export const getStageDetails = async (req: Request, res: Response) => {
  const { id } = req.params;
  const stageId = parseInt(id, 10);

  if (isNaN(stageId) || stageId < 1) {
    return res.status(400).json({ message: `Invalid stage ID: ${id}` });
  }

  try {
    const stage = await readPrisma.pipelineStage.findUnique({
      where: { id: stageId },
      include: {
        candidates: {
          where: { deletedAt: null },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            status: true,
            createdAt: true,
          },
        },
        _count: {
          select: { candidates: true },
        },
      },
    });

    if (!stage) {
      return res.status(404).json({ message: `Stage with ID ${id} not found` });
    }

    res.status(200).json({ data: stage });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error fetching stage details for ID: ${id}`,
      'pipelineStageController.getStageDetails',
    );
  }
};

// Reorder pipeline stages
export const reorderStages = async (req: Request, res: Response) => {
  const { stageOrders }: { stageOrders: { id: number; order: number }[] } =
    req.body;

  if (!Array.isArray(stageOrders)) {
    return res.status(400).json({ message: 'Invalid stage orders format' });
  }

  try {
    // Start a transaction to ensure all updates succeed or none do
    await writePrisma.$transaction(
      async (prisma: {
        pipelineStage: {
          update: (arg0: {
            where: { id: number };
            data: { order: number };
          }) => unknown;
        };
      }) => {
        for (const { id, order } of stageOrders) {
          await prisma.pipelineStage.update({
            where: { id },
            data: { order },
          });
        }
      },
    );

    const updatedStages = await readPrisma.pipelineStage.findMany({
      orderBy: { order: 'asc' },
    });

    res.status(200).json({
      message: 'Pipeline stages reordered successfully',
      data: updatedStages,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error occurred while reordering pipeline stages',
      'pipelineStageController.reorderStages',
      JSON.stringify(req.body),
    );
  }
};
