import prisma from './prisma';
import cron from 'node-cron';

// Run every 10 seconds
cron.schedule('*/10 * * * * *', async () => {
  console.log('Running a task every 10 seconds');
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
});
