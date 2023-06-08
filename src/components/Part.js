// @ts-nocheck
import React, { useState, useEffect } from "react";

export default function Part() {
	const [parts, setParts] = useState([]);

	useEffect(() => {
		fetchParts();
	}, []);

	function fetchParts() {
		fetch('http://localhost:8080/part/getParts')
		.then(response => response.json())
		.then(partsData => setParts(partsData))
		.catch(error => console.error(error));	
	}

	return (
		<div className="container parts">
		<h1 className=" mb-3">Parts</h1>
			<table className="table table-striped parts-table">
				<thead>
					<tr>
						<th scope="col">Part No</th>
						<th scope="col">Part Name</th>
						<th scope="col">Part Description</th>
						<th scope="col">Current Price</th>
					</tr>
				</thead>
				<tbody>
					{parts.map((part) => (
						<tr key={part.part_no_748}>
							<td>{part.part_no_748}</td>
							<td>{part.part_name_748}</td>
							<td>{part.part_description_748}</td>
							<td>{part.current_price_748}</td>
						</tr>						
					))}
				</tbody>
			</table>
		</div>
	);
}
