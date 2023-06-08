import "./App.css";
import NavBar from "./components/AppBar.js";
import Part from "./components/Part.js";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import PurchaseOrder from "./components/PurchaseOrder";
import PurchaseOrderList from "./components/PurchaseOrderList";

function App() {
  return (
    <div className="App">
      <NavBar />
      <br/><br/><Part />
      <br/><br/><PurchaseOrderList/>
      <hr/><br/><br/><PurchaseOrder />
    </div>
  );
}

export default App;
