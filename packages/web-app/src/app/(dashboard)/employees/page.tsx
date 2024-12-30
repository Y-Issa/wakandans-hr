import { Metadata } from 'next';
import UsersList from './UserList';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Employees | Wakandans HR',
    description:
      'Manage all employees in the HR management system for Wakandans',
  };
}

export default function EmployeesPage() {
  return <UsersList />;
}
