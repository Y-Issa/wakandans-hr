-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "jobs";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "private";

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'EMPLOYEE', 'MANAGER', 'HR');

-- CreateEnum
CREATE TYPE "jobs"."JobStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELED', 'RETRY');

-- CreateEnum
CREATE TYPE "jobs"."JobType" AS ENUM ('EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'SLACK', 'CANDIDATE');

-- CreateEnum
CREATE TYPE "public"."CandidateStatus" AS ENUM ('INITIAL', 'SCHEDULED_FOR_INTERVIEW', 'CODE_CHALLENGE_SENT', 'OFFER_SENT', 'OFFER_REJECTED', 'HIRED');

-- CreateEnum
CREATE TYPE "public"."InterviewStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "public"."CommunicationType" AS ENUM ('EMAIL', 'PHONE_CALL', 'SMS', 'MEETING');

-- CreateEnum
CREATE TYPE "public"."QuestionType" AS ENUM ('MULTIPLE_CHOICE', 'OPEN_ENDED', 'CODING', 'SYSTEM_DESIGN');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "reportsToId" INTEGER,
    "role" "public"."UserRole" NOT NULL,
    "workSettingId" INTEGER,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Profile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT,
    "employedAt" TIMESTAMP(3),
    "dateOfBirth" TIMESTAMP(3),
    "profileImage" TEXT,
    "additionalInfo" JSONB,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserAuth" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "loginToken" TEXT,
    "refreshToken" TEXT,
    "sessionId" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAuth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Status" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CalendarStatus" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "fromDate" TIMESTAMP(3) NOT NULL,
    "toDate" TIMESTAMP(3) NOT NULL,
    "isFullDay" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "statusId" INTEGER NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,

    CONSTRAINT "CalendarStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Department" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "locationId" INTEGER,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "locationId" INTEGER,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "locationId" INTEGER,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserGroup" (
    "userId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserGroup_pkey" PRIMARY KEY ("userId","groupId")
);

-- CreateTable
CREATE TABLE "public"."UserTeam" (
    "userId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTeam_pkey" PRIMARY KEY ("userId","teamId")
);

-- CreateTable
CREATE TABLE "public"."UserDepartment" (
    "userId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDepartment_pkey" PRIMARY KEY ("userId","departmentId")
);

-- CreateTable
CREATE TABLE "public"."Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "companyId" INTEGER NOT NULL,
    "workSettingId" INTEGER,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DayOff" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "fromDate" TIMESTAMP(3) NOT NULL,
    "toDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "DayOff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CompanyConfiguration" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "locationId" INTEGER,
    "logo" TEXT,
    "description" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CompanyConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CompanyConfigurationDayOff" (
    "id" SERIAL NOT NULL,
    "companyConfigurationId" INTEGER NOT NULL,
    "dayOffId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyConfigurationDayOff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "externalEmailsAllowed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."PrivateProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "salary" DOUBLE PRECISION,
    "address" TEXT,
    "phoneNumber" TEXT,
    "secondaryPhoneNumber" TEXT,
    "secondaryEmail" TEXT,
    "emergencyContactName" TEXT,
    "emergencyContactNumber" TEXT,

    CONSTRAINT "PrivateProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private"."UserHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "updateType" TEXT NOT NULL,
    "updateDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "previousData" JSONB,
    "currentData" JSONB,

    CONSTRAINT "UserHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs"."Job" (
    "id" SERIAL NOT NULL,
    "type" "jobs"."JobType" NOT NULL,
    "status" "jobs"."JobStatus" NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "failureCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WorkSetting" (
    "id" SERIAL NOT NULL,
    "remoteWorkAllowed" BOOLEAN NOT NULL DEFAULT false,
    "hybridWorkAllowed" BOOLEAN NOT NULL DEFAULT false,
    "inOfficeAvailable" BOOLEAN NOT NULL DEFAULT true,
    "flexibleHours" BOOLEAN NOT NULL DEFAULT false,
    "partTime" BOOLEAN NOT NULL DEFAULT false,
    "timeZone" TEXT NOT NULL,
    "workingSchedule" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "maxDaysOffPerYear" INTEGER NOT NULL DEFAULT 20,
    "maxOooMinsPerDay" INTEGER NOT NULL DEFAULT 149,
    "pdAllowancePerYear" INTEGER NOT NULL DEFAULT 1000,

    CONSTRAINT "WorkSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Candidate" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "tags" JSONB,
    "linkedInProfile" TEXT,
    "resumeUrl" TEXT,
    "notes" TEXT,
    "status" "public"."CandidateStatus" NOT NULL DEFAULT 'INITIAL',
    "pipelineStageId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Interview" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "interviewerId" INTEGER NOT NULL,
    "interviewTypeId" INTEGER NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "actualStartTime" TIMESTAMP(3),
    "actualEndTime" TIMESTAMP(3),
    "feedback" JSONB,
    "questionBankId" INTEGER,
    "status" "public"."InterviewStatus" NOT NULL DEFAULT 'SCHEDULED',
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CommunicationLog" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "public"."CommunicationType" NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommunicationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Question" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "type" "public"."QuestionType" NOT NULL,
    "category" TEXT,
    "difficulty" TEXT,
    "expectedTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "questionBankId" INTEGER NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QuestionBank" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionBank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PipelineStage" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PipelineStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InterviewType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_locationId_idx" ON "public"."User"("locationId");

-- CreateIndex
CREATE INDEX "User_reportsToId_idx" ON "public"."User"("reportsToId");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "public"."User"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "public"."Profile"("userId");

-- CreateIndex
CREATE INDEX "Profile_userId_idx" ON "public"."Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuth_userId_key" ON "public"."UserAuth"("userId");

-- CreateIndex
CREATE INDEX "UserAuth_loginToken_idx" ON "public"."UserAuth"("loginToken");

-- CreateIndex
CREATE INDEX "UserAuth_refreshToken_idx" ON "public"."UserAuth"("refreshToken");

-- CreateIndex
CREATE INDEX "UserAuth_sessionId_idx" ON "public"."UserAuth"("sessionId");

-- CreateIndex
CREATE INDEX "Status_deletedAt_idx" ON "public"."Status"("deletedAt");

-- CreateIndex
CREATE INDEX "CalendarStatus_fromDate_toDate_idx" ON "public"."CalendarStatus"("fromDate", "toDate");

-- CreateIndex
CREATE INDEX "CalendarStatus_userId_idx" ON "public"."CalendarStatus"("userId");

-- CreateIndex
CREATE INDEX "CalendarStatus_deletedAt_idx" ON "public"."CalendarStatus"("deletedAt");

-- CreateIndex
CREATE INDEX "Department_companyId_locationId_idx" ON "public"."Department"("companyId", "locationId");

-- CreateIndex
CREATE INDEX "Department_deletedAt_idx" ON "public"."Department"("deletedAt");

-- CreateIndex
CREATE INDEX "Team_companyId_locationId_idx" ON "public"."Team"("companyId", "locationId");

-- CreateIndex
CREATE INDEX "Team_deletedAt_idx" ON "public"."Team"("deletedAt");

-- CreateIndex
CREATE INDEX "Group_companyId_locationId_idx" ON "public"."Group"("companyId", "locationId");

-- CreateIndex
CREATE INDEX "Group_deletedAt_idx" ON "public"."Group"("deletedAt");

-- CreateIndex
CREATE INDEX "Location_companyId_idx" ON "public"."Location"("companyId");

-- CreateIndex
CREATE INDEX "Location_deletedAt_idx" ON "public"."Location"("deletedAt");

-- CreateIndex
CREATE INDEX "DayOff_fromDate_toDate_idx" ON "public"."DayOff"("fromDate", "toDate");

-- CreateIndex
CREATE INDEX "DayOff_deletedAt_idx" ON "public"."DayOff"("deletedAt");

-- CreateIndex
CREATE INDEX "CompanyConfiguration_companyId_idx" ON "public"."CompanyConfiguration"("companyId");

-- CreateIndex
CREATE INDEX "CompanyConfiguration_locationId_idx" ON "public"."CompanyConfiguration"("locationId");

-- CreateIndex
CREATE INDEX "CompanyConfiguration_deletedAt_idx" ON "public"."CompanyConfiguration"("deletedAt");

-- CreateIndex
CREATE INDEX "CompanyConfigurationDayOff_companyConfigurationId_idx" ON "public"."CompanyConfigurationDayOff"("companyConfigurationId");

-- CreateIndex
CREATE INDEX "CompanyConfigurationDayOff_dayOffId_idx" ON "public"."CompanyConfigurationDayOff"("dayOffId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyConfigurationDayOff_companyConfigurationId_dayOffId_key" ON "public"."CompanyConfigurationDayOff"("companyConfigurationId", "dayOffId");

-- CreateIndex
CREATE INDEX "Company_deletedAt_idx" ON "public"."Company"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateProfile_userId_key" ON "private"."PrivateProfile"("userId");

-- CreateIndex
CREATE INDEX "UserHistory_userId_idx" ON "private"."UserHistory"("userId");

-- CreateIndex
CREATE INDEX "WorkSetting_deletedAt_idx" ON "public"."WorkSetting"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_email_key" ON "public"."Candidate"("email");

-- CreateIndex
CREATE INDEX "Candidate_pipelineStageId_idx" ON "public"."Candidate"("pipelineStageId");

-- CreateIndex
CREATE INDEX "Interview_candidateId_idx" ON "public"."Interview"("candidateId");

-- CreateIndex
CREATE INDEX "Interview_interviewerId_idx" ON "public"."Interview"("interviewerId");

-- CreateIndex
CREATE INDEX "Interview_interviewTypeId_idx" ON "public"."Interview"("interviewTypeId");

-- CreateIndex
CREATE INDEX "CommunicationLog_candidateId_idx" ON "public"."CommunicationLog"("candidateId");

-- CreateIndex
CREATE INDEX "CommunicationLog_userId_idx" ON "public"."CommunicationLog"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PipelineStage_name_key" ON "public"."PipelineStage"("name");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewType_name_key" ON "public"."InterviewType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "public"."Tag"("name");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_reportsToId_fkey" FOREIGN KEY ("reportsToId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_workSettingId_fkey" FOREIGN KEY ("workSettingId") REFERENCES "public"."WorkSetting"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAuth" ADD CONSTRAINT "UserAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CalendarStatus" ADD CONSTRAINT "CalendarStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CalendarStatus" ADD CONSTRAINT "CalendarStatus_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "public"."Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Department" ADD CONSTRAINT "Department_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Department" ADD CONSTRAINT "Department_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Group" ADD CONSTRAINT "Group_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Group" ADD CONSTRAINT "Group_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserGroup" ADD CONSTRAINT "UserGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserGroup" ADD CONSTRAINT "UserGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserTeam" ADD CONSTRAINT "UserTeam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserTeam" ADD CONSTRAINT "UserTeam_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserDepartment" ADD CONSTRAINT "UserDepartment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserDepartment" ADD CONSTRAINT "UserDepartment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Location" ADD CONSTRAINT "Location_workSettingId_fkey" FOREIGN KEY ("workSettingId") REFERENCES "public"."WorkSetting"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Location" ADD CONSTRAINT "Location_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CompanyConfiguration" ADD CONSTRAINT "CompanyConfiguration_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CompanyConfiguration" ADD CONSTRAINT "CompanyConfiguration_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CompanyConfigurationDayOff" ADD CONSTRAINT "CompanyConfigurationDayOff_companyConfigurationId_fkey" FOREIGN KEY ("companyConfigurationId") REFERENCES "public"."CompanyConfiguration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CompanyConfigurationDayOff" ADD CONSTRAINT "CompanyConfigurationDayOff_dayOffId_fkey" FOREIGN KEY ("dayOffId") REFERENCES "public"."DayOff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Candidate" ADD CONSTRAINT "Candidate_pipelineStageId_fkey" FOREIGN KEY ("pipelineStageId") REFERENCES "public"."PipelineStage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Interview" ADD CONSTRAINT "Interview_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "public"."Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Interview" ADD CONSTRAINT "Interview_interviewerId_fkey" FOREIGN KEY ("interviewerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Interview" ADD CONSTRAINT "Interview_interviewTypeId_fkey" FOREIGN KEY ("interviewTypeId") REFERENCES "public"."InterviewType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Interview" ADD CONSTRAINT "Interview_questionBankId_fkey" FOREIGN KEY ("questionBankId") REFERENCES "public"."QuestionBank"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommunicationLog" ADD CONSTRAINT "CommunicationLog_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "public"."Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommunicationLog" ADD CONSTRAINT "CommunicationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_questionBankId_fkey" FOREIGN KEY ("questionBankId") REFERENCES "public"."QuestionBank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
