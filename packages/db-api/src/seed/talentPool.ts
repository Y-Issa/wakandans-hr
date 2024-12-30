// src/seed/talentPool.ts
import { writePrisma } from '../prisma';

export const seedTalentPool = async () => {
  // Create Pipeline Stages with order
  await writePrisma.pipelineStage.createMany({
    data: [
      {
        name: 'Application Received',
        order: 1,
        description: 'Initial application submission',
      },
      { name: 'Phone Screen', order: 2, description: 'Initial HR screening' },
      {
        name: 'Technical Interview',
        order: 3,
        description: 'Technical evaluation phase',
      },
      {
        name: 'Offer Sent',
        order: 4,
        description: 'Offer extended to candidate',
      },
      { name: 'Hired', order: 5, description: 'Candidate accepted offer' },
      { name: 'Rejected', order: 6, description: 'Application rejected' },
    ],
    skipDuplicates: true,
  });

  // Create Interview Types with duration
  await writePrisma.interviewType.createMany({
    data: [
      {
        name: 'Phone Screen',
        description: 'Initial screening with HR.',
        duration: 30, // 30 minutes
      },
      {
        name: 'Technical',
        description: 'Technical evaluation by the team.',
        duration: 60, // 1 hour
      },
      {
        name: 'Behavioral',
        description: 'Behavioral and culture-fit interview.',
        duration: 45, // 45 minutes
      },
      {
        name: 'Managerial',
        description: 'Interview with the hiring manager.',
        duration: 60, // 1 hour
      },
    ],
    skipDuplicates: true,
  });

  // Create Question Banks
  const technicalBank = await writePrisma.questionBank.create({
    data: {
      name: 'Technical Interview Questions',
      description: 'Standard technical assessment questions',
    },
  });

  // Create Questions
  await writePrisma.question.createMany({
    data: [
      {
        content: 'Explain RESTful API principles',
        type: 'OPEN_ENDED',
        category: 'Technical',
        difficulty: 'Medium',
        expectedTime: 10,
        questionBankId: technicalBank.id,
      },
      {
        content:
          'What is the difference between let, const, and var in JavaScript?',
        type: 'OPEN_ENDED',
        category: 'Technical',
        difficulty: 'Easy',
        expectedTime: 5,
        questionBankId: technicalBank.id,
      },
    ],
  });

  // Create Tags
  await writePrisma.tag.createMany({
    data: [
      { name: 'JavaScript' },
      { name: 'React' },
      { name: 'Python' },
      { name: 'Data Science' },
      { name: 'Remote' },
      { name: 'Full Stack' },
    ],
    skipDuplicates: true,
  });

  // Get first pipeline stage ID for candidates
  const initialStage = await writePrisma.pipelineStage.findFirst({
    where: { name: 'Application Received' },
  });

  // Create Candidates with pipeline stage
  await writePrisma.candidate.createMany({
    data: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+123456789',
        pipelineStageId: initialStage?.id,
        tags: ['JavaScript', 'React'], // Store as JSON array
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+987654321',
        pipelineStageId: initialStage?.id,
        tags: ['Python', 'Data Science'], // Store as JSON array
      },
    ],
  });

  // Create Communication Logs
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

  // Create Interview records
  const technicalInterviewType = await writePrisma.interviewType.findFirst({
    where: { name: 'Technical' },
  });

  if (technicalInterviewType) {
    await writePrisma.interview.create({
      data: {
        candidateId: 1,
        interviewerId: 1,
        interviewTypeId: technicalInterviewType.id,
        scheduledAt: new Date('2024-12-01T10:00:00Z'),
        feedback: {
          technicalSkills: 8,
          communication: 7,
          notes: 'Strong technical background, good problem-solving skills',
        },
        status: 'SCHEDULED',
        location: 'https://meet.google.com/abc-defg-hij',
        questionBankId: technicalBank.id,
      },
    });
  }
};
