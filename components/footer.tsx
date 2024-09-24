import { signOut } from '@/lib/pocketbase';


export default function Footer() {
  return (
    <footer className="h-[10vh] p-2">
      <form action={signOut}>
        <button type="submit">Logga ut</button>
      </form>
      <a href="/admin">Admin</a>
    </footer>
  );
}