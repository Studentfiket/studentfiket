'use client'

import { useState } from 'react';
import { AppointmentAttributesType, AppointmentPicker } from 'react-appointment-picker';

const CalendarView = () => {
  type Appointment = {
    day: string,
    number: string | number,
    time: string,
    id: string
  };


  const [loading, setLoading] = useState(false);
  // const [continuousLoading, setContinuousLoading] = useState(false);

  const addAppointmentCallback = async (args: { addedAppointment: Appointment }) => {
    const { addedAppointment } = args;
    const { day, number, time, id } = addedAppointment;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(`Added appointment ${number}, day ${day}, time ${time}, id ${id}`);
    // addCb(day, number, time, id);
    setLoading(false);
  };

  const removeAppointmentCallback = async ({ day, number, time, id }: Appointment) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(`Removed appointment ${number}, day ${day}, time ${time}, id ${id}`);
    // removeCb(day, number);
    setLoading(false);
  };

  // const addAppointmentCallbackContinuousCase = async ({
  //   addedAppointment: { day, number, time, id },
  //   addCb,
  //   removedAppointment: params,
  //   removeCb
  // }) => {
  //   setContinuousLoading(true);
  //   if (removeCb) {
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     console.log(`Removed appointment ${params.number}, day ${params.day}, time ${params.time}, id ${params.id}`);
  //     removeCb(params.day, params.number);
  //   }
  //   await new Promise((resolve) => setTimeout(resolve, 1000));
  //   console.log(`Added appointment ${number}, day ${day}, time ${time}, id ${id}`);
  //   addCb(day, number, time, id);
  //   setContinuousLoading(false);
  // };

  // const removeAppointmentCallbackContinuousCase = async ({ day, number, time, id }, removeCb) => {
  //   setContinuousLoading(true);
  //   await new Promise((resolve) => setTimeout(resolve, 2000));
  //   console.log(`Removed appointment ${number}, day ${day}, time ${time}, id ${id}`);
  //   removeCb(day, number);
  //   setContinuousLoading(false);
  // };

  const days: AppointmentAttributesType[][] = [
    [
      { id: 1, number: 1, isSelected: true, periods: 2 },
      { id: 2, number: 2, isSelected: false },
      { id: 3, number: 3, isReserved: true },
      { id: 4, number: 4, isReserved: false },
      null,
      { id: 5, number: 5, isSelected: true },
      { id: 6, number: 6, isSelected: false }
    ],
    [
      { id: 7, number: 7, isSelected: false },
      { id: 8, number: 8, isSelected: false },
      null,
      { id: 9, number: 9, isReserved: true },
      { id: 10, number: 10, isReserved: false },
      null,
      { id: 11, number: 11, isSelected: true },
      { id: 12, number: 12, isSelected: false }
    ],
    [
      { id: 13, number: 13, isSelected: false },
      { id: 14, number: 14, isSelected: false },
      null,
      { id: 15, number: 15, isReserved: true },
      { id: 16, number: 16, isReserved: false },
      null,
      { id: 17, number: 17, isSelected: true },
      { id: 18, number: 18, isSelected: false }
    ],
    [
      { id: 19, number: 19, isSelected: false },
      { id: 20, number: 20, isSelected: false },
      null,
      { id: 21, number: 21, isReserved: true },
      { id: 22, number: 22, isReserved: false },
      null,
      { id: 23, number: 23, isSelected: true },
      { id: 24, number: 24, isSelected: false }
    ],
    [
      { id: 25, number: 25, isSelected: false },
      { id: 26, number: 26, isSelected: false },
      null,
      { id: 27, number: 27, isReserved: true },
      { id: 28, number: 28, isReserved: false },
      null,
      { id: 29, number: 29, isSelected: true },
      { id: 30, number: 30, isSelected: false }
    ]
  ];

  return (
    <div>
      <h1>Appointment Picker</h1>
      <AppointmentPicker
        // addAppointmentCallback={addAppointmentCallback}
        // removeAppointmentCallback={removeAppointmentCallback}
        initialDay={new Date()}
        days={days}
        maxReservableAppointments={3}
        alpha
        visible
        selectedByDefault
        loading={loading}
      />
    </div>
  );
};

export default CalendarView;
