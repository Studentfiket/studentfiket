'use client'

import { Button } from '@/components/ui/button';
import { generateNewPeriod } from '@/lib/pocketbase';

function Header() {
  const startDate = new Date("2024-09-16T08:00:00.000Z");
  const endDate = new Date("2024-09-20T17:00:00.000Z");

  return (
    <header>
      {/* <Button onClick={() => generateNewPeriod(startDate, endDate, false)}>Create shift</Button> */}
    </header>
  );
}

export default Header;