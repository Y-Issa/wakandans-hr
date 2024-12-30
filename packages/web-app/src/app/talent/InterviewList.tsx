'use client';

import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  Card,
  CardContent,
} from '@/components/ui/Card';
import { Calendar, Clock, UserRound, Video } from 'lucide-react';

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

interface InterviewListProps {
  interviews: Interview[];
  isLoading?: boolean;
  error?: string | null;
}

const InterviewList: React.FC<InterviewListProps> = ({
  interviews,
  isLoading = false,
  error = null,
}) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return <div className='p-4'>Loading interviews...</div>;
  }

  if (error) {
    return <div className='p-4 text-red-500'>{error}</div>;
  }

  return (
    <div className='space-y-4'>
      {interviews.map((interview) => (
        <Card key={interview.id}>
          <CardContent className='pt-6'>
            <div className='grid md:grid-cols-4 gap-4'>
              {/* Time and Type */}
              <div className='space-y-2'>
                <div className='flex items-center space-x-2'>
                  <Calendar className='h-4 w-4 text-gray-500' />
                  <span className='font-medium'>
                    {formatDateTime(interview.scheduledAt)}
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
                  <Clock className='h-4 w-4 text-gray-500' />
                  <span>{interview.interviewType.duration} minutes</span>
                </div>
              </div>

              {/* Candidate */}
              <div className='space-y-1'>
                <div className='text-sm text-gray-500'>Candidate</div>
                <div className='flex items-center space-x-2'>
                  <UserRound className='h-4 w-4 text-gray-500' />
                  <div>
                    <div className='font-medium'>
                      {interview.candidate.firstName}{' '}
                      {interview.candidate.lastName}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {interview.candidate.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Interviewer */}
              <div className='space-y-1'>
                <div className='text-sm text-gray-500'>Interviewer</div>
                <div className='flex items-center space-x-2'>
                  <UserRound className='h-4 w-4 text-gray-500' />
                  <div>
                    <div className='font-medium'>
                      {interview.interviewer.firstName}{' '}
                      {interview.interviewer.lastName}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {interview.interviewer.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Location and Status */}
              <div className='space-y-2'>
                {interview.location && (
                  <div className='flex items-center space-x-2'>
                    <Video className='h-4 w-4 text-gray-500' />
                    <a
                      href={interview.location}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:underline'
                    >
                      Join Meeting
                    </a>
                  </div>
                )}
                <div className='flex items-center space-x-2'>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      interview.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : interview.status === 'CANCELED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {interview.status}
                  </span>
                  <span className='text-sm text-gray-500'>
                    {interview.interviewType.name}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InterviewList;
