import { redirect } from 'next/navigation';

/** Local demonstration mode opens the console directly without a login gate. */
export default function LoginPage() {
  redirect('/dashboard');
}
