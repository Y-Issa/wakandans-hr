// src/controllers/candidatePipelineController.ts
import { Request, Response } from 'express';
import { writePrisma, readPrisma } from '../prisma';
import { handle500Response } from '../helpers';

// Extend Request type inline
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const moveToStage = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { stageId, notes } = req.body;
  const candidateId = parseInt(id, 10);
  const newStageId = parseInt(stageId, 10);

  if (isNaN(candidateId) || isNaN(newStageId)) {
    return res.status(400).json({ message: 'Invalid candidate or stage ID' });
  }

  try {
    // Get current stage before update
    const currentCandidate = await readPrisma.candidate.findUnique({
      where: { id: candidateId },
      select: { pipelineStageId: true },
    });

    if (!currentCandidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Update candidate's stage and create history entry in a transaction
    const [updatedCandidate, history] = await writePrisma.$transaction([
      writePrisma.candidate.update({
        where: { id: candidateId },
        data: { pipelineStageId: newStageId },
        include: {
          pipelineStage: true,
        },
      }),
      writePrisma.candidateStageHistory.create({
        data: {
          candidateId,
          fromStageId: currentCandidate.pipelineStageId,
          toStageId: newStageId,
          notes,
          createdBy: req.user?.id || 1, // Default to 1 if no user
        },
      }),
    ]);

    res.status(200).json({
      message: 'Candidate moved successfully',
      data: {
        candidate: updatedCandidate,
        history,
      },
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error moving candidate to new stage',
      'candidatePipelineController.moveToStage',
    );
  }
};

export const getCandidatesByStage = async (_req: Request, res: Response) => {
  try {
    const stages = await readPrisma.pipelineStage.findMany({
      orderBy: { order: 'asc' },
      include: {
        candidates: {
          where: { deletedAt: null },
          orderBy: { updatedAt: 'desc' },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            status: true,
            tags: true,
            createdAt: true,
            updatedAt: true,
          },
        },
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
      'Error fetching candidates by stage',
      'candidatePipelineController.getCandidatesByStage',
    );
  }
};

export const getStageHistory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const candidateId = parseInt(id, 10);

  if (isNaN(candidateId)) {
    return res.status(400).json({ message: 'Invalid candidate ID' });
  }

  try {
    const history = await readPrisma.candidateStageHistory.findMany({
      where: { candidateId },
      include: {
        fromStage: true,
        toStage: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ data: history });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error fetching candidate stage history',
      'candidatePipelineController.getStageHistory',
    );
  }
};
