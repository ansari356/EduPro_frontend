import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
// eslint-disable-next-line
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

// CountUp Number Animation Component
function CountUp({ end, duration = 2 }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const increment = end / (duration * 60);

      const counter = setInterval(() => {
        start += increment;
        if (start >= end) {
          clearInterval(counter);
          setCount(end);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);

      return () => clearInterval(counter);
    }
  }, [inView, end, duration]);

  return (
    <span ref={ref} aria-live="polite">
      {count}
    </span>
  );
}

// Sample Educators Data
const educators = [
  {
    name: "Dr. Amelia Carter",
    title: "Professor of Psychology",
    description:
      "Innovator in digital education, specializing in curriculum design and research methods. Passionate about empowering students.",
    image: "https://placehold.co/600x400?text=Amelia+Carter",
  },
  {
    name: "Dr. Jamal Watkins",
    title: "Associate Professor of Education",
    description:
      "Expert in student engagement and pedagogical leadership. Loves blended learning and classroom technology.",
    image: "https://placehold.co/600x400?text=Jamal+Watkins",
  },
  {
    name: "Ms. Emily Green",
    title: "Senior Lecturer in Online Learning",
    description:
      "Focused on creating accessible e-learning content and mentoring new educators.",
    image: "https://placehold.co/600x400?text=Emily+Green",
  },
];

// Sample Courses Data
const courses = [
  {
    title: "Introduction to Psychology",
    description:
      "Foundational concepts in cognitive and behavioral psychology.",
    icon: "bi bi-book",
  },
  {
    title: "Research Methods 101",
    description:
      "Comprehensive study of qualitative and quantitative research approaches.",
    icon: "bi bi-journal-bookmark",
  },
  {
    title: "Educational Psychology",
    description: "Psychological principles applied in educational settings.",
    icon: "bi bi-mortarboard",
  },
  {
    title: "Cognitive Psychology",
    description: "Explores mental processes such as memory and perception.",
    icon: "bi bi-lightbulb",
  },
  {
    title: "Statistics for Psychology",
    description: "Statistical techniques and analysis for psychology data.",
    icon: "bi bi-bar-chart",
  },
];

// Sample analytics data
const totalStudents = 178;
const totalCourses = courses.length;

const studentEnrollmentData = [
  { month: "Mar", students: 120 },
  { month: "Apr", students: 135 },
  { month: "May", students: 150 },
  { month: "Jun", students: 165 },
  { month: "Jul", students: 170 },
  { month: "Aug", students: 178 },
];

const studentsPerCourse = courses.map((course, idx) => ({
  course: course.title,
  students: [50, 60, 40, 35, 28][idx],
}));

// Animation variant for whole sections
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function HomePage() {
  const { currentLanguage, t } = useLanguage();
  
  return (
    <div
      className="min-vh-100 profile-root"
      style={{ background: "var(--color-background)" }}
    >
      <div className="container py-5">
        {/* Who We Are Section */}
        <motion.div
          className="row justify-content-center mb-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <div className="col-lg-12">
            <div
              className="card shadow-sm mb-4"
              style={{ borderRadius: "var(--border-radius-lg)" }}
            >
              <div className="card-body p-5">
                <div className="d-flex align-items-center mb-3">
                  <i
                    className="bi bi-mortarboard-fill me-3 text-main"
                    style={{ fontSize: "2.2rem" }}
                    aria-hidden="true"
                  />
                  <h2 className="section-title m-0">
                    {t('home.whoWeAre')}
                  </h2>
                </div>
                <p
                  className="mb-0 fw-medium"
                  style={{
                    color: "var(--color-primary-dark)",
                    fontSize: "1.15rem",
                    lineHeight: 1.6,
                  }}
                >
                  <span
                    style={{
                      color: "var(--color-primary-light)",
                      fontWeight: 700,
                    }}
                  >
                    EduPlatform
                  </span>{" "}
                  {t('home.whoWeAreDesc')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>



        {/* New Features Showcase */}
        <motion.div
          className="row justify-content-center mb-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <div className="col-lg-12">
            <div className="feature-showcase">
              <h3>
                <i className="bi bi-stars text-warning"></i>
                {t('home.newFeatures')}
              </h3>
              <div className="feature-grid">
                <div className="feature-card">
                  <div className="icon">🌙</div>
                  <h4>{t('home.darkMode')}</h4>
                  <p>
                    {t('home.darkModeDesc')}
                  </p>
                </div>
                <div className="feature-card">
                  <div className="icon">🌍</div>
                  <h4>{t('home.multiLanguage')}</h4>
                  <p>
                    {t('home.multiLanguageDesc')}
                  </p>
                </div>
                <div className="feature-card">
                  <div className="icon">⚙️</div>
                  <h4>{t('home.easySettings')}</h4>
                  <p>
                    {t('home.easySettingsDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Teaching Analytics Section - Charts Left, Counts Right */}
        <motion.div
          className="row justify-content-center mb-5 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={sectionVariants}
        >
          {/* Charts column */}
          <div className="col-lg-8 d-flex flex-column gap-4">
            <div
              className="card p-4 shadow-sm flex-grow-1"
              style={{ borderRadius: "var(--border-radius-lg)" }}
            >
              <h5 className="fw-bold mb-4 section-title">
                Student Enrollment Trend
              </h5>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart
                  data={studentEnrollmentData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                  />
                  <XAxis dataKey="month" stroke="var(--color-primary-dark)" />
                  <YAxis stroke="var(--color-primary-dark)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card-background)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="students"
                    stroke="var(--color-primary)"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div
              className="card p-4 shadow-sm flex-grow-1"
              style={{ borderRadius: "var(--border-radius-lg)" }}
            >
              <h5 className="fw-bold mb-4 section-title">
                Students per Course
              </h5>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={studentsPerCourse}
                  margin={{ top: 5, right: 20, left: 20, bottom: 40 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                  />
                  <XAxis
                    dataKey="course"
                    stroke="var(--color-primary-dark)"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="var(--color-primary-dark)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card-background)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="students"
                    fill="var(--color-primary)"
                    radius={[10, 10, 0, 0]}
                    barSize={25}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Counts column */}
          <div className="col-lg-3 d-flex flex-column gap-4 justify-content-center">
            <motion.div
              className="about-bubble text-center p-4"
              style={{ cursor: "default" }}
              aria-label="Total Students"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 6px 15px rgba(25, 118, 210, 0.3)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="fw-bold mb-1 text-main">
                <CountUp end={totalStudents} />
              </h3>
              <small className="about-subtitle fw-medium">Total Students</small>
            </motion.div>
            <motion.div
              className="about-bubble text-center p-4"
              style={{ cursor: "default" }}
              aria-label="Total Courses"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 6px 15px rgba(25, 118, 210, 0.3)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="fw-bold mb-1 text-main">
                <CountUp end={totalCourses} />
              </h3>
              <small className="about-subtitle fw-medium">
                Courses Offered
              </small>
            </motion.div>
          </div>
        </motion.div>

        {/* Educators Card Section */}
        <motion.div
          className="row mb-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <div className="col-12 mb-4 text-center">
            <h3 className="section-title">Meet Our Educators</h3>
          </div>
        </motion.div>
        <div className="row g-4 justify-content-center">
          {educators.map((ed, idx) => (
            <motion.div
              className="col-12 col-sm-8 col-md-6 col-lg-4"
              key={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionVariants}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 8px 20px rgba(25, 118, 210, 0.2)",
              }}
              style={{
                borderRadius: "var(--border-radius-lg)",
                overflow: "hidden",
              }}
            >
              <div className="card h-100 shadow-sm text-center d-flex flex-column">
                {/* Full-width profile picture at top */}
                <div style={{ height: 180, overflow: "hidden" }}>
                  <img
                    src={ed.image}
                    alt={`${ed.name} avatar`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    aria-label="Educator avatar"
                  />
                </div>
                {/* Card body with text */}
                <div className="card-body flex-grow-1 d-flex flex-column justify-content-center">
                  <h5
                    className="fw-bold mb-1 profile-main-title"
                    style={{ fontSize: "var(--font-size-xl)" }}
                  >
                    {ed.name}
                  </h5>
                  <div className="text-accent mb-2">{ed.title}</div>
                  <div
                    className="about-bubble px-3 py-2 mx-auto"
                    style={{ maxWidth: 275 }}
                  >
                    <span style={{ color: "var(--color-primary-dark)" }}>
                      {ed.description}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Courses We Provide Section */}
        <motion.div
          className="row mt-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <div className="col-12 mb-4 text-center">
            <h3 className="section-title">Courses We Provide</h3>
          </div>
          {courses.map((course, idx) => (
            <motion.div
              className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
              key={idx}
              aria-label={`Course: ${course.title}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionVariants}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 20px rgba(25, 118, 210, 0.15)",
              }}
              style={{ borderRadius: "var(--border-radius-lg)" }}
            >
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column align-items-center text-center p-4">
                  <i
                    className={`${course.icon} text-main mb-3`}
                    style={{ fontSize: "2rem" }}
                    aria-hidden="true"
                  />
                  <h5 className="fw-bold mb-2">{course.title}</h5>
                  <p
                    className="fw-medium"
                    style={{
                      color: "var(--color-primary-dark)",
                      fontSize: "0.9rem",
                    }}
                  >
                    {course.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
