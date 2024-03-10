import React,{ useState,useEffect } from "react";

import { redirect } from "react-router-dom";

import { Link } from 'react-router-dom';
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { unitDatas } from "./unitDatas";
import { unitID } from "./UnitLogin";

async function fetchDataFromFirestore() {
	const querySnapshot = await getDocs(collection(db, "test-db1"));
	const userData = [];
	for (const doc of querySnapshot.docs) {
		userData.push({ id: doc.id, ...doc.data() });
	}
	return userData;
}

function UnitDetails(){

	const [userData, setUserData] = useState([]);

	try{
		const unit = unitDatas[unitID][0].toLowerCase();
		const cluster = unitDatas[unitID][1].toLowerCase(); 
	}
    catch{
		window.location.href = '/';
	}

	const unit = unitDatas[unitID][0].toLowerCase();
	const cluster = unitDatas[unitID][1].toLowerCase();

	const fetchData = async () => {
		try {
			const userData = await fetchDataFromFirestore();
			setUserData(userData);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
		fetchData();
	}, []);

	const filteredUserData = userData.filter(
		(user) => user.unit === unit.toLowerCase(),
	);

	const personalData = []
	let total = 0

	// biome-ignore lint/complexity/noForEach: <explanation>
	filteredUserData.forEach((user) => {
		personalData.push({key: user.id, value:[user.name, user.phone,user.contribution]})
		total += user.contribution
	});

	personalData.sort((a, b) => b.value[2] - a.value[2]);

	const convertToExcel = () => {

		/*const sortedData = [...userData].sort((a, b) => {
		  // First sort by 'cluster'
		  const clusterComparison = a.cluster.localeCompare(b.cluster);
		  if (clusterComparison !== 0) {
			return clusterComparison;
		  }
		  
		  // If 'cluster' values are equal, then sort by 'unit' within the cluster
		  return a.unit.localeCompare(b.unit);
		});*/
  
  
		const formattedData = filteredUserData.map(item => ({
		  Cluster: item.cluster,
		  Unit: item.unit,
		  Name: item.name,
		  Phone: item.phone,
		  Contribution: item.contribution
		}));
		
		const fileName = unit+'_data.xlsx';
		const ws = XLSX.utils.json_to_sheet(formattedData);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Data');
		const excelBuffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
		saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), fileName);
	  };


    return(

		<div className="flex flex-col h-screen font-prim bg-sky-100">
            <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <Link to="/" className="text-l" style={{fontFamily: 'Liberation Mono, monospace', fontWeight: "lighter", fontSize:"18px"}}>IFTHAAR-CHALLENGE</Link>
                <div>
                    <Link to="/home" className="mr-2" >Home</Link>
                </div>
            </div>
            <div className="flex flex-col items-center overflow-hidden mt-0 p-5 px-4 flex-grow">
                <p className="text-xl font-semibold" style={{fontFamily: 'Liberation Mono, monospace', fontWeight: "inherit", fontSize:"22px"}}>Unit Wise Details</p>
                <div className="bg-white w-full rounded-lg shadow-md px-8 py-10 mb-4 mt-3">
                    <label htmlFor="cluster" className="flex items-center mb-2">
			        	<input
			        		disabled
			        		type="text"
			        		name="cluster"
			        		value={`${`Cluster - ${cluster.toUpperCase()}`}`}
							style={{fontSize:"16px"}}
			        		className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-sky-500"
			        	/>
			        </label>
			        <label htmlFor="unit" className="flex items-center mb-2">
			        	<input
			        		disabled
			        		type="text"
			        		name="unit"
			        		value={`${`Unit - ${unit.toUpperCase()}`}`}
							style={{fontSize:"16px"}}
			        		className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-sky-500"
			        	/>
			        </label>
                </div>
                <div className="overflow-y-auto w-full max-w-md">
                    {personalData.map((data, index) => (
                        <div
        					className={` flex justify-between border border-gray-300 rounded-lg p-4 mb-4 shadow-md ${
        						index === 0 ? "bg-[#90EE90]" :
        						index === 1 ? "bg-[#ADD8E6]" :
        						index === 2 ? "bg-[#D3D3D3]" :
        						"bg-[#E6E6FA]" /* Default background color */
        					}`}
        				key={data.key}
                        > 
                        <div className="flex-1"> <p className="text-xl" style={{fontFamily: 'Liberation Mono, monospace', fontWeight: "lighter", fontSize:"17px"}}>{data.value[0]}</p></div>
                        <div className="flex-1"><p className="text-gray-600">{data.value[1]}</p></div>
                        <p className="text-gray-600">{data.value[2]}</p>
                        </div>
                    ))}
                </div>
                <div className="w-full mt-auto max-w-md bg-white flex justify-between border border-gray-300 rounded-lg p-4 mb-4 shadow-md">
        	    	<p className="text-xl" style={{fontFamily: 'Liberation Mono, monospace', fontWeight: "inherit", fontSize:"18px"}}>Total Contributions</p>
        	    	<p className="text-gray-600">{total}</p>
        	    </div>
				<button
					type="button"
					onClick={convertToExcel}
					className="bg-sky-500 text-white py-2 px-4 w-full rounded-md hover:bg-sky-700 mb-4"
				>
					Download details
				</button>
            </div>
        </div>

    )
}

export default UnitDetails