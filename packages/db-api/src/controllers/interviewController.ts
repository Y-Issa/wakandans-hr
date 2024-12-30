import { Request, Response } from 'express';
import { writePrisma, readPrisma } from '../prisma';
import { handle500Response } from '../helpers';

export const getAllInterviews = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const take = limit + 1;

  try {
    const interviews = await readPrisma.interview.findMany({
      skip: page * limit,
      take,
      include: {
        candidate: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        interviewer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        interviewType: true,
        questionBank: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });

    const next = interviews.length > limit;
    if (next) {
      interviews.pop();
    }

    res.status(200).json({ data: interviews, next });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error fetching interviews',
      'interviewController.getAllInterviews',
    );
  }
};

export const getInterviewById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const interviewId = parseInt(id, 10);

  if (isNaN(interviewId)) {
    return res.status(400).json({ message: 'Invalid interview ID' });
  }

  try {
    const interview = await readPrisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        candidate: true,
        interviewer: true,
        interviewType: true,
        questionBank: {
          include: {
            questions: true,
          },
        },
      },
    });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.status(200).json({ data: interview });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error fetching interview',
      'interviewController.getInterviewById',
    );
  }
};

export const createInterview = async (req: Request, res: Response) => {
  const {
    candidateId,
    interviewerId,
    interviewTypeId,
    scheduledAt,
    questionBankId,
    location,
  } = req.body;

  try {
    const interview = await writePrisma.interview.create({
      data: {
        candidateId,
        interviewerId,
        interviewTypeId,
        scheduledAt: new Date(scheduledAt),
        questionBankId,
        location,
        status: 'SCHEDULED',
      },
      include: {
        candidate: true,
        interviewer: true,
        interviewType: true,
      },
    });

    // Update candidate status
    await writePrisma.candidate.update({
      where: { id: candidateId },
      data: { status: 'SCHEDULED_FOR_INTERVIEW' },
    });

    res.status(201).json({ data: interview });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error creating interview',
      'interviewController.createInterview',
    );
  }
};

export const updateInterview = async (req: Request, res: Response) => {
  const { id } = req.params;
  const interviewId = parseInt(id, 10);
  const {
    scheduledAt,
    status,
    feedback,
    actualStartTime,
    actualEndTime,
    location,
  } = req.body;

  try {
    const interview = await writePrisma.interview.update({
      where: { id: interviewId },
      data: {
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
        status,
        feedback,
        actualStartTime: actualStartTime
          ? new Date(actualStartTime)
          : undefined,
        actualEndTime: actualEndTime ? new Date(actualEndTime) : undefined,
        location,
      },
      include: {
        candidate: true,
        interviewer: true,
        interviewType: true,
      },
    });

    res.status(200).json({ data: interview });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error updating interview',
      'interviewController.updateInterview',
    );
  }
};

export const getInterviewsByDateRange = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  try {
    const interviews = await readPrisma.interview.findMany({
      where: {
        scheduledAt: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        },
      },
      include: {
        candidate: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        interviewer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        interviewType: true,
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });

    res.status(200).json({ data: interviews });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error fetching interviews by date range',
      'interviewController.getInterviewsByDateRange',
    );
  }
};

export const getInterviewTypes = async (_req: Request, res: Response) => {
  try {
    const interviewTypes = await readPrisma.interviewType.findMany();

    res.status(200).json({ data: interviewTypes });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error fetching interview types',
      'interviewController.getInterviewTypes',
    );
  }
};
