import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { addDays, isSameDay } from "date-fns";

export default function NoSlotsDialog({ isOpen, onClose, onCheckNextDay, onCheckSpecificDate }) {
  const tomorrow = addDays(new Date(), 1);
  const [selectedDate, setSelectedDate] = useState(tomorrow);

  const handleDateSelect = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleConfirm = () => {
    if (selectedDate) {
      if (isSameDay(selectedDate, tomorrow)) {
        onCheckNextDay();
      } else {
        onCheckSpecificDate(selectedDate);
      }
    }
  };

  const isTomorrowSelected = selectedDate && isSameDay(selectedDate, tomorrow);

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>No Available Slots</AlertDialogTitle>
          <AlertDialogDescription>
            There are no available delivery slots for the selected date. You can check tomorrow or pick a different date below.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="flex justify-center py-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
            defaultMonth={tomorrow}
            disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleConfirm}>
              {isTomorrowSelected ? 'Check Tomorrow' : 'Check Selected Date'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}