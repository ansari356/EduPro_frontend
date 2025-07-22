export default function SectionTitle({ title, className , id}) {
	return (
		<h2 id={id} className={`fw-bold mb-4 fs-2 primary-text ${className}`}>{title}</h2>
	);
}
