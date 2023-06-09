// @ts-nocheck
import React, { useState, useEffect } from "react";

export default function Part() {
	const [parts, setParts] = useState([]);
	const [partId, setPartId] = useState(0);
	const [part, setPart] = useState();

	useEffect(() => {
		fetchParts();
	}, []);

	function fetchParts() {
		fetch('http://localhost:8080/part/getParts')
		.then(response => response.json())
		.then(partsData => setParts(partsData))
		.catch(error => console.error(error));	
	}

	const getPartDetails = (event) => {
        event.preventDefault();

        if (part) {
            setPart();
            return;
        }

        // checking if partNo is unique
		var partNoExists = false;
		parts.forEach((part) =>  {
			if (part.part_no_748 === partId) {
				partNoExists = true;
			}
		});
		if (!partNoExists) {
			alert("Part Number with number " + partId + " does not exists.");
			return;
		}

        fetch("http://localhost:8080/part/getPart?partNo748=" + partId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json", 
            },
        })
        .then((response) => response.json())
        .then((partDetails) => {
            setPart(partDetails)
        });
    }

	const handlePartIdChange = (event) => {
		setPartId(parseInt(event.target.value));
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
			<div>
				<div>
					<h1 className=" mb-3">Get Part Details</h1> 
					<form>
						<div className="form-floating mb-3">
							<input type="number" defaultValue={partId} className="form-control" 
								onChange={handlePartIdChange}/>
							<label>Enter Part No. :- </label>
						</div>
						<button className="btn btn-primary mt-4" onClick={getPartDetails}>Get Part Data</button>
					</form>
				</div>
				{part && 
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
							<tr>
								<td>{part.part_no_748}</td>
								<td>{part.part_name_748}</td>
								<td>{part.part_description_748}</td>
								<td>{part.current_price_748}</td>
							</tr>						
						</tbody>
					</table>
				}
			</div>
		</div>
	);
}
