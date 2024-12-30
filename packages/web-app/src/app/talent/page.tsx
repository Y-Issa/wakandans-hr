'use client';

import React, { useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { Users, Calendar, MessageSquare, FileText } from 'lucide-react';
import InterviewList from './InterviewList';
import ScheduleInterviewDialog from './ScheduleInterviewDialog';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  tags: string[];
}

interface PipelineStage {
  id: number;
  name: string;
  order: number;
  candidates: Candidate[];
  _count: {
    candidates: number;
  };
}

interface CandidateCardProps {
  candidate: Candidate;
  index: number;
}

interface StageColumnProps {
  stage: PipelineStage;
  candidates: Candidate[];
}

interface Interview {
  id: number;
  scheduledAt: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELED';
  location: string | null;
  candidate: {
    firstName: string;
    lastName: string;
    email: string;
  };
  interviewer: {
    firstName: string;
    lastName: string;
    email: string;
  };
  interviewType: {
    name: string;
    duration: number;
  };
}

interface InterviewFormData {
  candidateId: number;
  interviewerId: number;
  interviewTypeId: number;
  scheduledAt: string;
  location: string;
}

interface InterviewerOption {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface InterviewTypeOption {
  id: number;
  name: string;
  duration: number;
  description?: string;
}

interface CandidateOption {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, index }) => (
  <Draggable draggableId={`candidate-${candidate.id}`} index={index}>
    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
    {/* @ts-ignore */}
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`bg-gray-50 p-3 rounded-md ${
          snapshot.isDragging ? 'shadow-lg ring-2 ring-primary' : ''
        }`}
      >
        <p className='font-medium'>{`${candidate.firstName} ${candidate.lastName}`}</p>
        <p className='text-sm text-gray-600'>{candidate.email}</p>
        {candidate.tags && (
          <div className='mt-2 flex flex-wrap gap-1'>
            {candidate.tags.map((tag) => (
              <span
                key={tag}
                className='text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full'
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    )}
  </Draggable>
);

const StageColumn: React.FC<StageColumnProps> = ({ stage, candidates }) => (
  <Droppable droppableId={`stage-${stage.id}`}>
    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
    {/* @ts-ignore */}
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className={`border rounded-lg p-4 ${
          snapshot.isDraggingOver ? 'bg-gray-50' : ''
        }`}
      >
        <h3 className='font-medium mb-4'>
          {stage.name}
          <span className='ml-2 text-sm text-gray-500'>
            ({stage._count.candidates})
          </span>
        </h3>
        <div className='space-y-2'>
          {candidates.map((candidate, index) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              index={index}
            />
          ))}
          {provided.placeholder}
        </div>
      </div>
    )}
  </Droppable>
);

const TalentPoolDashboard = () => {
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    totalCandidates: 0,
    upcomingInterviews: 0,
    pendingFeedback: 0,
    offersSent: 0,
  });
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [interviewsLoading, setInterviewsLoading] = useState(true);
  const [interviewsError, setInterviewsError] = useState<string | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [interviewers, setInterviewers] = useState<InterviewerOption[]>([]);
  const [interviewTypes, setInterviewTypes] = useState<InterviewTypeOption[]>(
    [],
  );
  const [candidateOptions, setCandidateOptions] = useState<CandidateOption[]>(
    [],
  );
  const [optionsLoading, setOptionsLoading] = useState(true);

  useEffect(() => {
    fetchPipelineData();
    fetchInterviews();
  }, []);

  useEffect(() => {
    if (!loading && stages.length > 0) {
      const upcomingInterviewsCount = interviews.filter(
        (interview) =>
          interview.status === 'SCHEDULED' &&
          new Date(interview.scheduledAt) > new Date(),
      ).length;

      setMetrics((prev) => ({
        ...prev,
        upcomingInterviews: upcomingInterviewsCount,
      }));
    }
  }, [interviews, loading, stages]);

  const fetchPipelineData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/candidates/by-stage`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pipeline data');
      }

      const data = await response.json();
      console.log('Pipeline data:', data);
      const stagesData = data.data;
      setStages(stagesData);

      // Calculate metrics
      const totalCandidates = stagesData.reduce(
        (acc: number, stage: PipelineStage) => acc + stage._count.candidates,
        0,
      );

      // Count upcoming interviews (interviews that are scheduled and in the future)
      const upcomingInterviewsCount = interviews.filter(
        (interview) =>
          interview.status === 'SCHEDULED' &&
          new Date(interview.scheduledAt) > new Date(),
      ).length;

      setMetrics({
        totalCandidates,
        upcomingInterviews: upcomingInterviewsCount,
        pendingFeedback: 0,
        offersSent:
          stagesData.find((s: PipelineStage) => s.name === 'Offer Sent')?._count
            .candidates || 0,
      });

      setLoading(false);
    } catch (err) {
      setError('Failed to load pipeline data');
      setLoading(false);
      console.error('Error fetching pipeline data:', err);
    }
  };

  const fetchInterviews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/interviews`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch interviews');
      }

      const data = await response.json();
      setInterviews(data.data);
      setInterviewsLoading(false);
    } catch (err) {
      setInterviewsError('Failed to load interviews');
      setInterviewsLoading(false);
      console.error('Error fetching interviews:', err);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const moveCandidate = async (candidateId: number, newStageId: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/candidates/stage/${candidateId}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stageId: newStageId,
            notes: 'Moved by user',
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to move candidate');
      }

      // Refresh pipeline data
      fetchPipelineData();
    } catch (err) {
      console.error('Error moving candidate:', err);
      setError('Failed to move candidate');
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Drop outside valid area or same position
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const candidateId = parseInt(draggableId.replace('candidate-', ''));
    const newStageId = parseInt(destination.droppableId.replace('stage-', ''));

    try {
      // Optimistically update the UI
      const updatedStages = [...stages];
      const sourceStage = updatedStages.find(
        (s) => `stage-${s.id}` === source.droppableId,
      );
      const destStage = updatedStages.find(
        (s) => `stage-${s.id}` === destination.droppableId,
      );

      if (sourceStage && destStage) {
        const [movedCandidate] = sourceStage.candidates.splice(source.index, 1);
        destStage.candidates.splice(destination.index, 0, movedCandidate);
        setStages(updatedStages);
      }

      // Make API call to update the backend
      const response = await fetch(
        `${API_BASE_URL}/candidates/${candidateId}/stage`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            stageId: newStageId,
            notes: 'Moved via drag and drop',
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to update candidate stage');
      }

      // Refresh data to ensure consistency
      fetchPipelineData();
    } catch (err) {
      console.error('Error updating candidate stage:', err);
      // Rollback optimistic update by refreshing data
      fetchPipelineData();
    }
  };

  const handleScheduleInterview = async (interviewData: InterviewFormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/interviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(interviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to schedule interview');
      }

      await fetchInterviews(); // Refresh interviews list
      setShowScheduleDialog(false); // Close dialog on success
    } catch (error) {
      console.error('Error scheduling interview:', error);
      throw error;
    }
  };

  const fetchInterviewOptions = async () => {
    try {
      const [interviewersRes, typesRes, candidatesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/users/management`, {
          credentials: 'include',
        }),
        fetch(`${API_BASE_URL}/interviews/types`, {
          credentials: 'include',
        }),
        fetch(
          `${API_BASE_URL}/candidates?status=INITIAL,SCHEDULED_FOR_INTERVIEW`,
          {
            credentials: 'include',
          },
        ),
      ]);

      const [interviewersData, typesData, candidatesData] = await Promise.all([
        interviewersRes.json(),
        typesRes.json(),
        candidatesRes.json(),
      ]);

      setInterviewers(interviewersData.data);
      setInterviewTypes(typesData.data);
      setCandidateOptions(candidatesData.data);
      return true;
    } catch (error) {
      console.error('Error fetching interview options:', error);
      return false;
    } finally {
      setOptionsLoading(false);
    }
  };

  const handleScheduleClick = async () => {
    setOptionsLoading(true);
    const success = await fetchInterviewOptions();
    if (success) {
      setShowScheduleDialog(true);
    }
  };

  if (loading) {
    return <div className='p-6'>Loading pipeline data...</div>;
  }

  if (error) {
    return <div className='p-6 text-red-500'>{error}</div>;
  }

  return (
    <div className='p-6 max-w-7xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-2'>Talent Pool</h1>
        <p className='text-gray-600'>
          Manage candidates, interviews, and hiring pipeline
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
        <Card>
          <CardHeader className='flex flex-row items-center space-x-2'>
            <Users className='h-4 w-4' />
            <CardTitle>Total Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{metrics.totalCandidates}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center space-x-2'>
            <Calendar className='h-4 w-4' />
            <CardTitle>Upcoming Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{metrics.upcomingInterviews}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center space-x-2'>
            <MessageSquare className='h-4 w-4' />
            <CardTitle>Pending Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{metrics.pendingFeedback}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center space-x-2'>
            <FileText className='h-4 w-4' />
            <CardTitle>Offers Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>{metrics.offersSent}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue='pipeline' className='w-full'>
        <TabsList>
          <TabsTrigger value='pipeline'>Pipeline</TabsTrigger>
          <TabsTrigger value='interviews'>Interviews</TabsTrigger>
          <TabsTrigger value='candidates'>Candidates</TabsTrigger>
          <TabsTrigger value='templates'>Templates</TabsTrigger>
        </TabsList>

        <TabsContent value='pipeline'>
          <Card>
            <CardHeader>
              <CardTitle>Talent Pipeline</CardTitle>
              <CardDescription>
                Track candidates through the hiring process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={handleDragEnd}>
                <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
                  {stages.map((stage) => (
                    <StageColumn
                      key={stage.id}
                      stage={stage}
                      candidates={stage.candidates}
                    />
                  ))}
                </div>
              </DragDropContext>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='interviews'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <div>
                <CardTitle>Interview Schedule</CardTitle>
                <CardDescription>Upcoming and past interviews</CardDescription>
              </div>
              <Button onClick={() => handleScheduleClick()} className='ml-auto'>
                <Plus className='w-4 h-4 mr-2' />
                Schedule Interview
              </Button>
            </CardHeader>
            <CardContent>
              <InterviewList
                interviews={interviews}
                isLoading={interviewsLoading}
                error={interviewsError}
              />
            </CardContent>
          </Card>
          <ScheduleInterviewDialog
            isOpen={showScheduleDialog}
            onClose={() => setShowScheduleDialog(false)}
            onSchedule={handleScheduleInterview}
            interviewers={interviewers}
            interviewTypes={interviewTypes}
            candidates={candidateOptions}
            isLoading={optionsLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TalentPoolDashboard;
