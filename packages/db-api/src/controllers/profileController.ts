import { Request, Response } from 'express';
import { writePrisma, readPrisma } from '../prisma';
import { handle500Response } from '../helpers';

const minimalProfileSelect = {
  id: true,
  userId: true,
  title: true,
  employedAt: true,
  dateOfBirth: true,
  profileImage: true,
  additionalInfo: true,
};

export const getAllProfiles = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const take = limit + 1;

  try {
    const profiles = await readPrisma.profile.findMany({
      skip: page * limit,
      take,
      select: minimalProfileSelect,
    });

    const next = profiles.length > limit;
    if (next) {
      profiles.pop();
    }

    res.status(200).json({ data: profiles, next });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error occurred while fetching profiles',
      'profileController.getAllProfiles',
    );
  }
};

export const getProfileById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);

  if (isNaN(idInt) || idInt < 1) {
    return res.status(400).json({ message: `Invalid profile ID: ${id}` });
  }

  try {
    const profile = await readPrisma.profile.findUnique({
      where: { id: idInt },
      select: minimalProfileSelect,
    });

    if (!profile) {
      return res
        .status(404)
        .json({ message: `Profile with ID ${id} not found` });
    }

    res.json(profile);
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error fetching profile with ID: ${id}`,
      'profileController.getProfileById',
    );
  }
};

export const createProfile = async (req: Request, res: Response) => {
  const {
    userId,
    title,
    employedAt,
    dateOfBirth,
    profileImage,
    additionalInfo,
  } = req.body;

  try {
    const newProfile = await writePrisma.profile.create({
      data: {
        userId,
        title,
        employedAt,
        dateOfBirth,
        profileImage,
        additionalInfo,
      },
      select: minimalProfileSelect,
    });

    res.status(201).json({
      message: `Profile ${newProfile.id} created successfully`,
      data: newProfile,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      'Error creating profile',
      'profileController.createProfile',
      JSON.stringify(req.body),
    );
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);

  if (isNaN(idInt) || idInt < 1) {
    return res.status(400).json({ message: `Invalid profile ID: ${id}` });
  }

  const updateData = req.body;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, ...validData } = updateData;
  try {
    const updatedProfile = await writePrisma.profile.update({
      where: { id: idInt },
      data: validData,
      select: minimalProfileSelect,
    });

    res.status(200).json({
      message: `Profile ${id} updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error updating profile with ID: ${id}`,
      'profileController.updateProfile',
      JSON.stringify(updateData),
    );
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idInt = parseInt(id, 10);

  if (isNaN(idInt) || idInt < 1) {
    return res.status(400).json({ message: `Invalid profile ID: ${id}` });
  }

  try {
    await writePrisma.profile.delete({ where: { id: idInt } });
    res.status(200).json({ message: `Profile ${id} deleted successfully` });
  } catch (error) {
    handle500Response(
      res,
      error,
      `Error deleting profile with ID: ${id}`,
      'profileController.deleteProfile',
    );
  }
};
