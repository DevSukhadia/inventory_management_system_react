// @ts-nocheck
import React, { useState, useEffect } from "react";

export default function PurchaseOrderList() {
	const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [selectedPoNo, setSelectedPoNo] = useState(0);
    const [lines, setLines] = useState();

	useEffect(() => {
		fetchPurchaseOrders();
	}, []);

	function fetchPurchaseOrders() {
		fetch('http://localhost:8080/purchaseOrder/getAll')
		.then(response => response.json())
		.then(poData => setPurchaseOrders(poData))
        .catch(error => console.error(error));	
	}

    const handleSelectedPoNoChange = (event) => {
        setSelectedPoNo(parseInt(event.target.value));
    }

    const getPODetails = (event) => {
        event.preventDefault();

        if (lines) {
            setLines();
            return;
        }

        // checking if purchaseOrderNo is unique
		var purchaseOrderNoExists = false;
		purchaseOrders.forEach((purchaseOrder) =>  {
			if (purchaseOrder.po_no_748 === selectedPoNo) {
				purchaseOrderNoExists = true;
			}
		});
		if (!purchaseOrderNoExists) {
			alert("Purchase Order with number " + selectedPoNo + " does not exists.");
			return;
		}

        fetch("http://localhost:8080/purchaseOrder/getPurchaseOrder?po_no_748=" + selectedPoNo, {
            method: "GET",
            headers: {
                "Content-Type": "application/json", 
            },
        })
        .then((response) => response.json())
        .then((lines) => {
            setLines(lines)
        });
    } 

	return (
		<div className="container parts">
            <div>
                <h1 className=" mb-3">Purchase Orders</h1>
                <table className="table table-striped parts-table">
                    <thead>
                        <tr>
                            <th scope="col">Purchase Order No</th>
                            <th scope="col">Status</th>
                            <th scope="col">Date</th>
                            <th scope="col">Client</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchaseOrders.map((purchaseOrder) => (
                            <tr key={purchaseOrder.po_no_748} id={purchaseOrder.po_no_748 + "po"}>
                                <td>{purchaseOrder.po_no_748}</td>
                                <td>{purchaseOrder.status_748}</td>
                                <td>{purchaseOrder.date_of_po_748}</td>
                                <td>{purchaseOrder.client748.client_name_748}</td>
                            </tr>						
                        ))}
                    </tbody>
                </table>
            </div>
            <br/><br/>
            <div>
                <h1 className=" mb-3">Get Purchase Order Details</h1> 
                <form>
                    <div className="form-floating mb-3">
                        <input value={selectedPoNo} className="form-control" 
                            onChange={handleSelectedPoNoChange}/>
                        <label>Enter Po No. :- </label>
                    </div>
                    <button className="btn btn-primary mt-4" onClick={getPODetails}>Get PO Data</button>
                </form>
            </div>
            {lines && 
                <div>
                    <br/>
                    <h3 className=" mb-3">Lines in PO : {selectedPoNo}</h3> 
                    <table className="table table-striped parts-table">
                        <thead>
                            <tr>
                                <th scope="col">Part</th>
                                <th scope="col">Price Ordered</th>
                                <th scope="col">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                        {lines.map((line) => {
                            return (
                                <tr key={line.lineId748.part748.part_no_748} id={line.lineId748.part748.part_no_748 + "line"}>
                                    <td>{line.lineId748.part748.part_name_748}</td>
                                    <td>{line.priceOrdered}</td>
                                    <td>{line.quantity}</td>
                                </tr>  
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            }          
        </div>          
	);
}
