import { writePrisma } from '../prisma';

export const seedTalentPool = async () => {
  await writePrisma.pipelineStage.createMany({
    data: [
      { name: 'Application Received' },
      { name: 'Phone Screen' },
      { name: 'Technical Interview' },
      { name: 'Offer Sent' },
      { name: 'Hired' },
      { name: 'Rejected' },
    ],
  });

  await writePrisma.interviewType.createMany({
    data: [
      { name: 'Phone Screen', description: 'Initial screening with HR.' },
      { name: 'Technical', description: 'Technical evaluation by the team.' },
      {
        name: 'Behavioral',
        description: 'Behavioral and culture-fit interview.',
      },
      { name: 'Managerial', description: 'Interview with the hiring manager.' },
    ],
  });

  await writePrisma.tag.createMany({
    data: [
      { name: 'JavaScript' },
      { name: 'React' },
      { name: 'Python' },
      { name: 'Data Science' },
      { name: 'Remote' },
      { name: 'Full Stack' },
    ],
  });

  await writePrisma.candidate.createMany({
    data: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+123456789',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+987654321',
      },
    ],
  });

  await writePrisma.communicationLog.createMany({
    data: [
      {
        candidateId: 1,
        userId: 1,
        type: 'EMAIL',
        message: 'Scheduled interview for December 1st.',
      },
      {
        candidateId: 2,
        userId: 1,
        type: 'PHONE_CALL',
        message: 'Discussed salary expectations.',
      },
    ],
  });
};
