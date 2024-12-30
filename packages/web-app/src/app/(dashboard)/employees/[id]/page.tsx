import EmployeeProfile from '@/components/employees/EmployeeProfile';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Employee Profile',
    description:
      'View employee profile in the HR management system for Wakandans',
  };
}

export default function NewEmployeePage() {
  return <EmployeeProfile />;
}
