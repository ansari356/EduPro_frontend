import Scrollspy from 'react-scrollspy';
import { BsBook, BsCalendarEvent, BsBarChartLine, BsGear } from 'react-icons/bs';
import './Dashboard.css';

const HEADER_HEIGHT = 80;

const handleClick = (e, id) => {
  e.preventDefault();
  const element = document.getElementById(id);
  if (element) {
    const yOffset = -HEADER_HEIGHT;
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'instant' });
  }
};

export default function SideBar() {
  return (
    <div className="sidebar">
      <h5 style={{ color: '#1a3967' }}>On This Page:</h5>
      <Scrollspy
        items={['active-courses', 'upcoming-sessions', 'student-engagement', 'course-management']}
        currentClassName="active"
        offset={-HEADER_HEIGHT}
        componentTag="div"
      >
        <a href="#active-courses" className="sidebar-link d-flex align-items-center" onClick={e => handleClick(e, 'active-courses')}>
          <BsBook className="me-2 sidebar-icon" /> Active Courses
        </a>
        <a href="#upcoming-sessions" className="sidebar-link d-flex align-items-center" onClick={e => handleClick(e, 'upcoming-sessions')}>
          <BsCalendarEvent className="me-2 sidebar-icon" /> Upcoming Sessions
        </a>
        <a href="#student-engagement" className="sidebar-link d-flex align-items-center" onClick={e => handleClick(e, 'student-engagement')}>
          <BsBarChartLine className="me-2 sidebar-icon" /> Student Engagement
        </a>
        <a href="#course-management" className="sidebar-link d-flex align-items-center" onClick={e => handleClick(e, 'course-management')}>
          <BsGear className="me-2 sidebar-icon" /> Course Management
        </a>
      </Scrollspy>
    </div>
  );
}
