import NewEmployeeForm from '@/components/employees/NewEmployeeForm';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Create Employee',
    description:
      'Create a new employee in the HR management system for Wakandans',
  };
}

export default function NewEmployeePage() {
  return <NewEmployeeForm />;
}
