import { Request, Response } from 'express';
import { writePrisma, readPrisma } from '../prisma';
import { handle500Response } from '../helpers';

const minimalCandidateSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  createdAt: true,
  updatedAt: true,
};

export const getAllCandidates = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const take = limit + 1;

  try {
    const candidates = await readPrisma.candidate.findMany({
      where: {
        deletedAt: null,
      },
      select: minimalCandidateSelect,
      skip: page * limit,
      take,
    });

    const next = candidates.length > limit;
    if (next) {
      candidates.pop();
    }

    res.status(200).json({ data: candidates, next });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error occurred while fetching candidates',
      'candidateController.getAllcandidates',
    );
  }
};

export const getCandidateById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);

  if (isNaN(idInt) || idInt < 1) {
    return res.status(400).json({ message: `Invalid candidate ID: ${id}` });
  }

  try {
    const candidate = await readPrisma.candidate.findUnique({
      where: {
        id: idInt,
      },
      select: minimalCandidateSelect,
    });

    if (!candidate) {
      return res
        .status(404)
        .json({ message: `candidate with ID ${id} not found` });
    }

    return res.json(candidate);
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error fetching candidate with ID: ${id}`,
      'candidateController.getcandidateById',
    );
  }
};

export const createCandidate = async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    tags,
    linkedInProfile,
    resumeUrl,
    notes,
    status,
  } = req.body;

  try {
    const newCandidate = await writePrisma.candidate.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        tags,
        linkedInProfile,
        resumeUrl,
        notes,
        status,
      },
      select: minimalCandidateSelect,
    });

    res.status(201).json({
      message: `candidate ${newCandidate.id} created successfully`,
      data: newCandidate,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error creating candidate`,
      'candidateController.createcandidate',
      JSON.stringify(req.body),
    );
  }
};

export const updateCandidate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);

  if (isNaN(idInt) || idInt < 1) {
    return res.status(400).json({ message: `Invalid candidate ID: ${id}` });
  }

  const updateData = req.body;
  const { ...validData } = updateData;

  try {
    const updatedCandidate = await writePrisma.candidate.update({
      where: { id: idInt },
      data: validData,
      select: minimalCandidateSelect,
    });

    res.status(200).json({
      message: `candidate ${id} updated successfully`,
      data: updatedCandidate,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error updating candidate with ID: ${id}`,
      'candidateController.updatecandidate',
      JSON.stringify(updateData),
    );
  }
};

export const deleteCandidate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);

  if (isNaN(idInt) || idInt < 1) {
    return res.status(400).json({ message: `Invalid candidate ID: ${id}` });
  }

  try {
    const deletedcandidate = await writePrisma.candidate.update({
      where: { id: idInt },
      data: {
        deletedAt: new Date(),
      },
      select: minimalCandidateSelect,
    });

    res.status(200).json({
      message: `candidate ${id} soft-deleted successfully`,
      data: deletedcandidate,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error soft-deleting candidate with ID: ${id}`,
      'candidateController.softDeletecandidate',
    );
  }
};
