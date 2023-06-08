// @ts-nocheck
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function PurchaseOrder() {
	const [clients, setClients] = useState([]);
	const [parts, setParts] = useState([]);
	const [purchaseOrders, setPurchaseOrders] = useState([]);
	const [selectedPurchaseOrderNo, setSelectedPurchaseOrderNo] = useState();
	const [selectedClientId, setSelectedClientId] = useState();
	const [partQuantityPairs, setPartQuantityPairs] = useState([]);
	const [status, setStatus] = useState("");
	
	useEffect(() => {
		fetchParts();
		fetchClients();
		fetchPurchaseOrders();
	}, []);

    const handleSave = (event) => {
		event.preventDefault();

		const purchaseOrderCreateEndpoint = "http://localhost:8080/purchaseOrder/create";

		// checking if purchaseOrderNo is unique
		var purchaseOrderNoExists = false;
		purchaseOrders.forEach((purchaseOrder) =>  {
			if (purchaseOrder.po_no_748 === selectedPurchaseOrderNo) {
				purchaseOrderNoExists = true;
			}
		});
		if (purchaseOrderNoExists) {
			alert("Purchase Order Number already exists.");
			return;
		}

		// checking if clientId exists
		var clientExists = false;
		clients.forEach((client) =>  {
			if (client.client_id_748 === selectedClientId) {
				clientExists = true;
			}
		});
		if (!clientExists) {
			alert("Invalid client Id.");
			return;
		}

		// Validation
		if (partQuantityPairs.length === 0) {
			alert("Select atleast 1 part.");
			return;
		}

		var selectedClient = undefined;
		if (selectedClientId === 0) {
			selectedClient = clients[0].client_id_748;
			setSelectedClientId();
		}
		else {
			selectedClient = parseInt(selectedClientId);
		}

		// setting data for request
		const data = {
			clientId: selectedClient,
			partQuantityPairs: partQuantityPairs,
			status: status,
			poNo: selectedPurchaseOrderNo,
		};

		fetch(purchaseOrderCreateEndpoint, {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(data)				
		})
		.then((response) => {
			if (response.ok) {
				alert("Purchase Order submitted successfully.");
				window.location.reload();
			}
			else {
				alert("Not able to submit Purchase Order.");
			}
		});

		setPartQuantityPairs([])
		setStatus("");
		setSelectedClientId(0)
	}

	// Fetchers
	function fetchParts() {
		fetch('http://localhost:8080/part/getParts')
		.then(response => response.json())
		.then(partsData => setParts(partsData))
		.catch(error => console.error(error));	
	}

	function fetchClients() {
		fetch('http://localhost:8080/client/getClients')
		.then(response => response.json())
		.then(clientsData => {
			setClients(clientsData) 
		}).catch(error => console.error(error));	
	}

	function fetchPurchaseOrders() {
		fetch('http://localhost:8080/purchaseOrder/getAll')
		.then(response => response.json())
		.then(poData => {
			setPurchaseOrders(poData) 
		}).catch(error => console.error(error));	
	}

	// On Change Event Handlers
	const handleSelectedPurchaseOrderNo = (event) => {
		setSelectedPurchaseOrderNo(parseInt(event.target.value));
	}

	const handleSelectedClientIdChange = (event) => {
		setSelectedClientId(parseInt(event.target.value));
	};

	const handlestatusChange = (event) => {
		setStatus(event.target.value);
	};

	const handleSelectedPartChange = (value) => {
		var existingIndex;
		if (partQuantityPairs.length === 0) {
			existingIndex = -1;
		}
		else {
			existingIndex = partQuantityPairs.findIndex((data) => data.part_no_748 === value);
		}

		if (existingIndex === -1) {
  			// Add the new data if it is not already present
			const newPartQuantityPair = {
				part_no_748: value,
				q_748: document.getElementById(value + "q").value
			};

			setPartQuantityPairs((prevArray) => [...prevArray, newPartQuantityPair]);
		} 
		else {
  			// Remove the existing data if it is already present
			setPartQuantityPairs((prevArray) => {
				const newArray = [...prevArray];
				newArray.splice(existingIndex, 1);
				return newArray;
			});
		}
	};

	const handleQuantityChange = (part_no, target) => {
		// void function
		var existingIndex;
		if (partQuantityPairs.length === 0) {
			existingIndex = -1;
		}
		else {
			existingIndex = partQuantityPairs.findIndex((data) => data.part_no_748 === part_no);
		}

		if (existingIndex !== -1) {
  			// Remove the existing data if it is already present
			setPartQuantityPairs((prevArray) => {
				const newArray = [...prevArray];
				newArray.splice(existingIndex, 1);
				return newArray;
			});
			// Add the new data if it is not already present
			const newPartQuantityPair = {
				part_no_748: part_no,
				q_748: document.getElementById(part_no + "q").value
			};

			setPartQuantityPairs((prevArray) => [...prevArray, newPartQuantityPair]);
		}
	}

	return (
		<div className="text-center pt-4 b PurchaseOrder container mt-4 mb-4">
		<h1 className=" mb-3">Create a Purchase Order</h1>
			<form>
				{/* Purchase Order Number */}
				<div className="form-floating mb-3">
					<input type="number" onChange={handleSelectedPurchaseOrderNo} id="poNo" className="form-control"/>
					<label htmlFor="poNo">Enter Purchase Order Number:-</label>
				</div>

				{/* Client Id */}
				<div className="form-floating mb-3">
					<input type="number" onChange={handleSelectedClientIdChange} id="clientId" className="form-control" />
					<label htmlFor="clientId">Enter Client Id:-</label>
				</div>

				{/* Load Parts */}
				<b>Select parts and quantity&nbsp;:-&nbsp;&nbsp;&nbsp;</b> 
				<div className="form-floating mb-3 d-flex justify-content-center gap-5 flex-wrap">
					{parts.map((part) => (
						<div key={part.part_no_748} className="d-flex flex-row justify-content-center align-items-center form-check mb-3 mt-3">
							<input className="form-check-input p-2" type="checkbox" id={part.part_no_748} value={part.part_no_748}
								onChange={() => handleSelectedPartChange(part.part_no_748)} />
							<label className="form-check-label p-2" htmlFor={part.part_no_748}>{part.part_name_748}</label>
							<div className="form-floating">
								<select
									className="form-select"
									defaultValue={1}
									style={{ width: '100px' }}
									id={[part.part_no_748] + "q"}
									onChange={(e) => handleQuantityChange(part.part_no_748, e.target)}
								>
									{Array.from({ length: part.qoh_748 }, (_, index) => (
										<option key={index + 1} value={index + 1}>{index + 1}</option>
									))}
								</select>
								<label htmlFor={[part.part_no_748] + "q"}>Quantity</label>
							</div>
						</div>
					))}
				</div>

				{/* for Status */}
				<div className="form-floating mb-3">
					<input type="text" className="form-control" id="floatingStatus" 
						onChange={handlestatusChange} value={status}/>
					<label htmlFor="floatingStatus">Enter Status :-</label>
				</div>
				<button className="btn btn-primary mt-4" onClick={handleSave}>Submit</button>
			</form>
		</div>
	);
}

export default PurchaseOrder;
