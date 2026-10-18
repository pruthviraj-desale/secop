import { redirect } from 'next/navigation';

export default function UnusedPublicPage() {
  redirect('/dashboard');
}
