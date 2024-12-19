import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Users, Calendar, MessageSquare, FileText } from 'lucide-react';

const TalentPoolDashboard = () => {
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
            <p className='text-2xl font-bold'>156</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center space-x-2'>
            <Calendar className='h-4 w-4' />
            <CardTitle>Upcoming Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>12</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center space-x-2'>
            <MessageSquare className='h-4 w-4' />
            <CardTitle>Pending Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>8</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center space-x-2'>
            <FileText className='h-4 w-4' />
            <CardTitle>Offers Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>3</p>
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
              <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
                {[
                  'Applied',
                  'Interview Scheduled',
                  'In Progress',
                  'Offer Sent',
                  'Hired',
                ].map((stage) => (
                  <div key={stage} className='border rounded-lg p-4'>
                    <h3 className='font-medium mb-4'>{stage}</h3>
                    <div className='space-y-2'>
                      {/* Placeholder for candidate cards */}
                      <div className='bg-gray-50 p-3 rounded-md'>
                        <p className='font-medium'>John Doe</p>
                        <p className='text-sm text-gray-600'>
                          Frontend Developer
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='interviews'>
          <Card>
            <CardHeader>
              <CardTitle>Interview Schedule</CardTitle>
              <CardDescription>Upcoming and past interviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {/* Calendar integration would go here */}
                <p className='text-gray-600'>
                  Calendar integration placeholder
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TalentPoolDashboard;
