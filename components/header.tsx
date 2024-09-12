'use client'

import { Button } from '@/components/ui/button';
import { createShift } from '@/lib/pocketbase';

function Header() {
  return (
    <header>
      <Button onClick={() => createShift("2024-09-13T12:00")}>Create shift</Button>
    </header>
  );
}

export default Header;