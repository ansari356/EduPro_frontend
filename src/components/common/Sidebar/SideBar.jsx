import Scrollspy from 'react-scrollspy';
import { BsBook, BsCalendarEvent, BsBarChartLine, BsGear } from 'react-icons/bs';
import '../Sidebar/SideBar.css'; // Assuming you have a CSS file for styling

const HEADER_HEIGHT = 80;

const handleClick = (e, id) => {
  e.preventDefault();
  const element = document.getElementById(id);
  if (element) {
    const yOffset = -HEADER_HEIGHT;
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, });
  }
};


export default function SideBar({linkesInSideBar}){
  return (
		<div className="sidebar">
			<h5 className="primary-text d-none d-md-block ">On This Page:</h5>
			<Scrollspy
				items={linkesInSideBar.map((link) => link.id)}
				currentClassName="active"
				offset={-HEADER_HEIGHT}
				componentTag="div"
			>


				{linkesInSideBar.map((link) => (
					<a
						key={link.id}
						href={`#${link.id}`}
						className="sidebar-link d-flex p-2 px-lg-3 align-items-center"
						onClick={(e) => handleClick(e, link.id)}
					>
						{link.children}
					</a>
				))}
			</Scrollspy>
		</div>
	);

}