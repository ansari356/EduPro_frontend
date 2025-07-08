export default function SectionTitle({ title, className }) {
	return (
		<h2 className={`fw-bold mb-4 fs-4 primary-text ${className}`}>{title}</h2>
	);
}
