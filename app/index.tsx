import { Redirect } from 'expo-router';

// The demo starts at the login screen, like the real app: Login drops the
// visitor into the dashboard, Sign up walks through account creation.
export default function Index() {
  return <Redirect href="/login" />;
}
