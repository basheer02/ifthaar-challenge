import { useState,useEffect } from "react";

import { Link } from 'react-router-dom'
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

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
	const [selectedCluster, setSelectedCluster] = useState("ph");
	const [selectedUnit, setSelectedUnit] = useState("ph");
    const [isVisible, setIsVisible] = useState(false);

    const unit = unitDatas[unitID][0]
	const cluster = unitDatas[unitID][1]; 

	const unitList = {
		pookiparamba: ['KULANGARA','KUNDANCHINA PAPPALIPARAMBA', 'KUNDUKKULAM', 'PARAMMAL', 'PARAPPURAM', 'POOKIPARAMBA'],
		edarikode: ['CHERUSHOLA - AREEKKAL', 'EDARIKKODE', 'KLARI MOOCHIKKAL', 'KLARI PUTHOOR', 'KLARI SOUTH', 'KURUKA', 'POTTIPPARA', 'PUTHUPPARAMBA', 'SWAGATHAMAD', 'VARAPPAMAD'],
		kozhichena: ['CHENAPPURAM', 'CHETTIYAM KINAR', 'CHIRAKKAL', 'KOZHICHENA','MAMU BAZAR', 'PERUMANNA', 'THIRUTHI'],
		thennala: ['ALUNGAL', 'APPLA EAST', 'APPLA WEST', 'ARAKKAL', 'CHEMMERIPARA', 'KODAKKALLU', 'THACHAMMAD', 'WEST BAZAR']
	};

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
		personalData.push({key: user.name, value:[user.contribution, user.phone]})
		total += user.contribution
	});

	personalData.sort((a, b) => b.value[0] - a.value[0]);

	const handleClusterChange = (e) => {
        const selectedCluster = e.target.value;
        setSelectedCluster(selectedCluster);
        unitList[selectedCluster].sort()
        // Reset unit to default value when cluster changes
        setSelectedUnit("ph");
        setIsVisible(false)
    };

	const handleUnitChange = (e) => {
        const unit = e.target.value;
        setSelectedUnit(unit);
		fetchData();
        setIsVisible(true)
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
			        		value={`${`Cluster - ${cluster}`}`}
			        		className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-sky-500"
			        	/>
			        </label>
			        <label htmlFor="unit" className="flex items-center mb-2">
			        	<input
			        		disabled
			        		type="text"
			        		name="unit"
			        		value={`${`Unit - ${unit}`}`}
			        		className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-sky-500"
			        	/>
			        </label>
                   {/*} <label htmlFor="cluster" className="flex items-center mb-4">
                        <select
                            name="cluster"
                            value={selectedCluster}
                            required
                            onChange={handleClusterChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-sky-500"
                        >
                            <option defaultChecked disabled value="ph">
                                Select Cluster
                            </option>
                            <option defaultChecked value="edarikode">
                                Edarikode
                            </option>
                            <option value="kozhichena">Kozhichena</option>
                            <option value="pookiparamba">Pookiparamba</option>
                            <option value="thennala">Thennala</option>
                        </select>
                    </label>
                    <label htmlFor="unit" className="flex items-center mb-4">
                        <select
                            name="unit"
                            required
                            value={selectedUnit}
                            onChange={handleUnitChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-sky-500"
                        >
                            <option disabled value="ph">Select Unit</option>
                            {unitList[selectedCluster]?.map((unitName) => (
                                <option key={unitName.toLowerCase()} value={unitName.toLowerCase()}>{unitName}</option>
                            ))}
                        </select>
                            </label> */}
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
                        <div className="flex-1"> <p className="text-xl" style={{fontFamily: 'Liberation Mono, monospace', fontWeight: "lighter", fontSize:"18px"}}>{data.key}</p></div>
                        <div className="flex-1"><p className="text-gray-600">{data.value[1]}</p></div>
                        <p className="text-gray-600">{data.value[0]}</p>
                        </div>
                    ))}
                </div>
                <div className="w-full mt-auto max-w-md bg-white flex justify-between border border-gray-300 rounded-lg p-4 mb-4 shadow-md">
        	    	<p className="text-xl" style={{fontFamily: 'Liberation Mono, monospace', fontWeight: "inherit", fontSize:"18px"}}>Total Contributions</p>
        	    	<p className="text-gray-600">{total}</p>
        	    </div>
            </div>
        </div>

    )
}

export default UnitDetails