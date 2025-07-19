import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "../Upcoming Sessions/UpcomingSessions.css";

export default function UpcomingSessions() {
  return (
    <div id="upcoming-sessions">
      <h4 className="fw-bold mb-4" style={{ color: "#1a3967" }}>Upcoming Sessions</h4>
      <div className='d-flex justify-content-center'>
      <Calendar />
      </div>
    </div>
  );
}
