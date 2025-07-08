import { Table } from "react-bootstrap";

import "./listTable.css";

export default function ListTable({ headerElements, listOfRows }) {
	return (
		<div className="border rounded-4 overflow-hidden p-2 ">
			<Table hover responsive className="border-0 list-table mb-0">
				<thead className="">
					<tr>
						<th>#</th>

						{headerElements.map((element, index) => (
							<th key={index}>{element}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{listOfRows.map((row, index) => (
						<tr key={index}>
							<td>
								<div>{index + 1}</div>
							</td>
							{row.map((element, index) => (
								<td key={index}>
									<div>{element}</div>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</Table>
		</div>
	);
}
