'use client'

import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { DateTime } from 'luxon';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Shift } from '@/lib/types';
import { getBookedShiftsForDate } from '@/lib/scheduling';
import { clearShift } from '@/app/actions/admin/clearShift';

function formatShiftTime(dateString: string): string {
  return DateTime.fromFormat(dateString, "yyyy-MM-dd HH:mm:ss.SSS'Z'", { zone: 'utc' }).toFormat('HH:mm');
}

function getShiftLabel(shift: Shift): string {
  const start = formatShiftTime(shift.start);
  const end = formatShiftTime(shift.end);
  return `${start}–${end}`;
}

function getOrganisationLabel(shift: Shift): string {
  if (shift.organisation) return shift.organisation;
  if (shift.workers.length > 0) return 'Privat';
  return '—';
}

function getWorkersLabel(shift: Shift): string {
  const names = shift.workers.filter(Boolean);
  return names.length > 0 ? names.join(', ') : '—';
}

export default function ClearShifts() {
  const [date, setDate] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shiftToClear, setShiftToClear] = useState<Shift | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadShifts = useCallback(async (selectedDate: Date) => {
    setIsLoading(true);
    setFeedback(null);
    // Skicka YYYY-MM-DD (lokal kalenderdag) så servern inte tappar dagen pga timezone
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const booked = await getBookedShiftsForDate(dateStr);
    setShifts(booked);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadShifts(date);
  }, [date, loadShifts]);

  const handleClear = async () => {
    if (!shiftToClear) return;

    setIsClearing(true);
    const result = await clearShift(shiftToClear.id);
    setIsClearing(false);
    setShiftToClear(null);

    if (result.success) {
      setFeedback({ type: 'success', message: result.message });
      await loadShifts(date);
    } else {
      setFeedback({ type: 'error', message: result.message });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Välj datum för att se bokade pass. Rensa tar bort förening och personer från passet i kalendern.
      </p>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto justify-start font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(date, 'dd MMM yyyy', { locale: sv })}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selected) => selected && setDate(selected)}
            weekStartsOn={1}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {feedback && (
        <Alert className={cn(
          'font-medium',
          feedback.type === 'success' ? 'bg-shift-free text-white' : 'bg-destructive text-white'
        )}>
          {feedback.message}
        </Alert>
      )}

      {isLoading ? (
        <p className="text-muted-foreground py-4">Laddar pass...</p>
      ) : shifts.length === 0 ? (
        <p className="text-muted-foreground py-4 rounded-md border bg-muted/30 px-4">
          Inga bokade pass denna dag.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tid</TableHead>
              <TableHead>Förening</TableHead>
              <TableHead>Personer</TableHead>
              <TableHead className="text-right">Åtgärd</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shifts.map((shift, index) => (
              <TableRow key={shift.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <TableCell className="font-medium">{getShiftLabel(shift)}</TableCell>
                <TableCell>{getOrganisationLabel(shift)}</TableCell>
                <TableCell>{getWorkersLabel(shift)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShiftToClear(shift)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Rensa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AlertDialog open={shiftToClear !== null} onOpenChange={(open) => !open && setShiftToClear(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rensa pass?</AlertDialogTitle>
            <AlertDialogDescription>
              {shiftToClear && (
                <>
                  Detta tar bort bokningen för passet{' '}
                  <span className="font-semibold">{getShiftLabel(shiftToClear)}</span>
                  {getOrganisationLabel(shiftToClear) !== '—' && (
                    <> ({getOrganisationLabel(shiftToClear)})</>
                  )}
                  . Passet blir ledigt i kalendern igen.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isClearing}>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleClear();
              }}
              disabled={isClearing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isClearing ? 'Rensar...' : 'Rensa pass'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
