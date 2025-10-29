
import React from 'react';
import { format } from 'date-fns';
import { Clock, Package, User, Hash, CheckCircle, Car, UserCheck } from 'lucide-react';

export default function PrintableScheduleView({ bookings, companyName, warehouseName, scheduleDate, isHistorical }) {
  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 20 && minute > 0) break;
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  // This function is kept as per instructions, but its direct usage for calculating duration is replaced by b.duration_minutes
  const getDurationMinutes = (start_time, end_time) => {
    const [startHour, startMin] = start_time.split(':').map(Number);
    const [endHour, endMin] = end_time.split(':').map(Number);
    const startTimeInMinutes = startHour * 60 + startMin;
    const endTimeInMinutes = endHour * 60 + endMin;
    return endTimeInMinutes - startTimeInMinutes;
  };

  const timeSlots = generateTimeSlots();

  // Get unique docks from bookings
  const docks = [...new Set(bookings.map(b => b.dock_name))].sort();
  const docksPerPage = docks.length <= 3 ? 3 : 5;
  const orientation = docks.length <= 3 ? 'portrait' : 'landscape';
  
  // Split docks into pages
  const dockPages = [];
  for (let i = 0; i < docks.length; i += docksPerPage) {
    dockPages.push(docks.slice(i, i + docksPerPage));
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="print-schedule">
        <div className="print-header">
          <h1>{companyName}</h1>
          {warehouseName && <h2>{warehouseName}</h2>}
          <p>Schedule for {scheduleDate ? format(new Date(`${scheduleDate}T00:00:00`), 'EEEE, MMMM d, yyyy') : 'N/A'}</p>
        </div>
        <div className="no-bookings">
          <p>No bookings scheduled for this day.</p>
        </div>
        <div className="print-footer">
          Printed on: {new Date().toLocaleString()}
        </div>
      </div>
    );
  }

  return (
    <div className="print-schedule">
      <style jsx>{`
        @media print {
          .print-schedule {
            font-family: Arial, sans-serif;
            font-size: 10px;
            line-height: 1.2;
            color: #000;
            background: white;
          }
          
          .print-header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
          }
          
          .print-header h1 {
            font-size: 18px;
            font-weight: bold;
            margin: 0 0 5px 0;
          }
          
          .print-header h2 {
            font-size: 15px;
            font-weight: normal;
            margin: 0 0 5px 0;
            color: #333;
          }
          
          .print-header p {
            font-size: 14px;
            margin: 0;
          }
          
          .schedule-grid {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          
          .schedule-grid th,
          .schedule-grid td {
            border: 1px solid #000;
            padding: 4px;
            vertical-align: top;
            text-align: left;
          }
          
          .schedule-grid th {
            background-color: #f0f0f0;
            font-weight: bold;
            text-align: center;
          }
          
          .time-cell {
            width: 60px;
            font-weight: bold;
            text-align: center;
            background-color: #f8f8f8;
          }
          
          .dock-cell {
            min-height: 30px;
            position: relative;
          }
          
          .booking-item {
            background-color: #e8f4f8;
            border: 1px solid #4a90a4;
            border-radius: 3px;
            padding: 3px;
            font-size: 9px;
            height: 100%;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          
          .booking-carrier {
            font-weight: bold;
            color: #1e40af;
            font-size: 10px;
            margin-bottom: 2px;
          }
          
          .booking-ref {
            font-family: monospace;
            font-size: 9px;
            color: #374151;
            margin-bottom: 2px;
          }
          
          .booking-details {
            font-weight: bold;
            color: #374151;
            font-size: 9px;
          }
          
          .arrival-info {
            background-color: #d1fae5;
            border-color: #10b981;
            margin-top: 2px;
          }
          
          .print-footer {
            position: fixed;
            bottom: 10px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 8px;
            color: #666;
          }
          
          .page-break {
            page-break-before: always;
          }
          
          @page {
            size: ${orientation};
            margin: 15mm;
          }
          
          .no-bookings {
            text-align: center;
            padding: 50px;
            font-size: 14px;
          }
        }
      `}</style>

      {dockPages.map((pageDocks, pageIndex) => (
        <div key={pageIndex} className={pageIndex > 0 ? 'page-break' : ''}>
          <div className="print-header">
            <h1>{companyName}</h1>
            {warehouseName && <h2>{warehouseName}</h2>}
            <p>Schedule for {scheduleDate ? format(new Date(`${scheduleDate}T00:00:00`), 'EEEE, MMMM d, yyyy') : 'N/A'}</p>
            {dockPages.length > 1 && <p>Page {pageIndex + 1} of {dockPages.length}</p>}
          </div>

          <table className="schedule-grid">
            <thead>
              <tr>
                <th className="time-cell">Time</th>
                {pageDocks.map(dockName => (
                  <th key={dockName}>{dockName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(slot => (
                <tr key={slot}>
                  <td className="time-cell">{formatTime(slot)}</td>
                  {pageDocks.map(dockName => {
                    const coveringBooking = bookings.find(b => {
                      if (b.dock_name !== dockName) return false;
                      
                      const [slotHour, slotMin] = slot.split(':').map(Number);
                      const slotTime = slotHour * 60 + slotMin;
                      
                      const [startHour, startMin] = b.start_time.split(':').map(Number);
                      const startTime = startHour * 60 + startMin;
                      
                      // Using b.duration_minutes as per the outline
                      const endTime = startTime + b.duration_minutes; 
                      
                      return slotTime >= startTime && slotTime < endTime;
                    });

                    if (!coveringBooking) {
                      return <td key={dockName} className="dock-cell" />;
                    }

                    // Checking if this slot is the actual start time of the booking as per the outline
                    if (coveringBooking.start_time === slot) {
                      // Using coveringBooking.duration_minutes as per the outline
                      const rowspan = Math.ceil(coveringBooking.duration_minutes / 30);
                      
                      return (
                        <td key={dockName} className="dock-cell" rowSpan={rowspan}>
                          <div className="booking-item">
                            <div className="booking-carrier">{coveringBooking.carrier_name}</div>
                            <div className="booking-ref">{coveringBooking.reference_number}</div>
                            <div className="booking-details">{coveringBooking.pallet_count} Pallets</div>
                            {isHistorical && coveringBooking.arrival_status === 'Arrived' && (
                              <div className="arrival-info">
                                ✓ Arrived on site
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    }
                    
                    // If the slot is covered by a booking but not its start time, it means a previous cell
                    // with a rowspan already covers this cell, so we return null to avoid rendering an empty td.
                    return null;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="print-footer">
        Printed on: {new Date().toLocaleString()}
      </div>
    </div>
  );
}
