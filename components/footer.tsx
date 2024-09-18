import { signOut } from '@/lib/pocketbase';


export default function Footer() {
  return (
    <footer className="py-4 px-8">
      <form action={signOut}>
        <button type="submit">Logga ut</button>
      </form>
    </footer>
  );
}