import prisma from './prisma';
import { JobStatus } from '@prisma/client';

export const runPendingJobs = async () => {
  try {
    const pendingJobs = await prisma.job.findMany({
      where: { status: JobStatus.PENDING },
      orderBy: { priority: 'desc' },
    });

    console.log(`Found ${pendingJobs.length} pending jobs`);
  } catch (error) {}
};
