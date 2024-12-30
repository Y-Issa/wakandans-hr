'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Loader2 } from 'lucide-react';

interface ScheduleInterviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (interviewData: InterviewFormData) => Promise<void>;
  interviewers: InterviewerOption[];
  interviewTypes: InterviewTypeOption[];
  candidates: CandidateOption[];
  isLoading: boolean;
}

interface ScheduleInterviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (interviewData: InterviewFormData) => Promise<void>;
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
}

interface InterviewTypeOption {
  id: number;
  name: string;
  duration: number;
}

interface CandidateOption {
  id: number;
  firstName: string;
  lastName: string;
}

const ScheduleInterviewDialog: React.FC<ScheduleInterviewDialogProps> = ({
  isOpen,
  onClose,
  onSchedule,
  interviewers,
  interviewTypes,
  candidates,
  isLoading,
}) => {
  const [formData, setFormData] = useState<InterviewFormData>({
    candidateId: 0,
    interviewerId: 0,
    interviewTypeId: 0,
    scheduledAt: '',
    location: '',
  });
  useEffect(() => {
    console.log('Dialog Props:', {
      interviewTypes,
      interviewers,
      candidates,
      isLoading,
    });
  }, [interviewTypes, interviewers, candidates, isLoading]);

  console.log('interview type', interviewTypes);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSchedule(formData);
      onClose();
    } catch (error) {
      console.error('Failed to schedule interview:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='sm:max-w-[475px]'>
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin' />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[475px]'>
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='candidate'>Candidate</Label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, candidateId: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select candidate' />
              </SelectTrigger>
              <SelectContent>
                {candidates.map((candidate) => (
                  <SelectItem
                    key={candidate.id}
                    value={candidate.id.toString()}
                  >
                    {`${candidate.firstName} ${candidate.lastName}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='interviewer'>Interviewer</Label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, interviewerId: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select interviewer' />
              </SelectTrigger>
              <SelectContent>
                {interviewers.map((interviewer) => (
                  <SelectItem
                    key={interviewer.id}
                    value={interviewer.id.toString()}
                  >
                    {`${interviewer.firstName} ${interviewer.lastName}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='type'>Interview Type</Label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, interviewTypeId: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select type' />
              </SelectTrigger>
              <SelectContent>
                {interviewTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {`${type.name} (${type.duration} mins)`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='datetime'>Date & Time</Label>
            <Input
              id='datetime'
              type='datetime-local'
              onChange={(e) =>
                setFormData({ ...formData, scheduledAt: e.target.value })
              }
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='location'>Location / Meeting Link</Label>
            <Input
              id='location'
              type='text'
              placeholder='Office location or video call link'
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
            />
          </div>

          <div className='flex justify-end space-x-3 pt-4'>
            <Button
              variant='outline'
              onClick={onClose}
              type='button'
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Scheduling...
                </>
              ) : (
                'Schedule Interview'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleInterviewDialog;
