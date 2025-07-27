import { Table } from "react-bootstrap";

import "./listTable.css";
import { useNavigate } from "react-router-dom";

export default function ListTable({ headerElements, listOfRows ,listOfLinks}) {
	const navigate = useNavigate();
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
						<tr style={{ cursor: "pointer" }} key={index} onClick={() => listOfLinks && navigate(listOfLinks[index])} className="cursor-pointer">
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
