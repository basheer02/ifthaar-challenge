import { useState, useEffect } from "react";

import SubmitForm from "./component/SubmitForm";
import { unitLogined } from "./component/UnitLogin";

import UnitLogin from "./component/UnitLogin";


import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

async function fetchDataFromFirestore() {
	const querySnapshot = await getDocs(collection(db, "test-db1"));
	const userData = [];
	for (const doc of querySnapshot.docs) {
		userData.push({ id: doc.id, ...doc.data() });
	}
	return userData;
}

function App() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const handleOpenModal = () => setIsModalOpen(true);
	const handleCloseModal = () => setIsModalOpen(false);

	const [isLoginModalOpen, setLoginModalOpen] = useState(false);
	const handleLoginOpenModal = () => setLoginModalOpen(true);
	const handleLoginCloseModal = () => setLoginModalOpen(false);

	const [userData, setUserData] = useState([]);
	const [selectedCluster, setSelectedCluster] = useState("");

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

	const handleModal = () => {
		if(unitLogined){
			handleOpenModal();
		}
		else{
			handleLoginOpenModal();
		}
	}

	const handleNewContribution = async () => {
		await fetchData();
	};

	const handleClusterSelection = (cluster) => {
		setSelectedCluster(cluster);
		fetchData();
		
	};

	const filteredUserData = userData.filter(
		(user) => user.cluster === selectedCluster,
	);

	const aggregatedData = {};
	// biome-ignore lint/complexity/noForEach: <explanation>
	filteredUserData.forEach((user) => {
		if (!aggregatedData[user.unit]) {
			aggregatedData[user.unit] = 0;
		}
		aggregatedData[user.unit] += user.contribution;
	});

	const sortedData = Object.entries(aggregatedData).map(
		([unit, contribution]) => ({ unit, contribution }),
	);
	sortedData.sort((a, b) => b.contribution - a.contribution);
	const totalContributions = userData.reduce(
		(total, user) => total + user.contribution,
		0,
	);
	return (
		<div className="flex-col h-screen font-prim flex">
			<div className="bg-gray-800 text-white p-4 flex justify-between items-center">
				<Link to="/" className="text-l" style={{fontFamily: 'Liberation Mono, monospace', fontWeight: "lighter", fontSize:"18px"}}>IFTHAAR-CHALLENGE</Link>
				{unitLogined && <div>
					<Link to='/unit-details' className="mr-2">Unit details</Link>
				</div>}
			</div>
			<div className="flex flex-col justify-center items-center p-2 px-4 overflow-hidden flex-grow">
				{isModalOpen && (
					<div className="fixed inset-0 px-4 bg-gray-500/50 backdrop-blur-sm z-50 flex justify-center items-center">
						<SubmitForm
							closeModal={handleCloseModal}
							onNewContribution={handleNewContribution}
						/>
					</div>
				)}
				{isLoginModalOpen && (
					<div className="fixed inset-0 px-4 bg-gray-500/50 backdrop-blur-sm z-50 flex justify-center items-center">
						<UnitLogin
							closeModal={handleLoginCloseModal}
						/>
					</div>
				)}
				<div className="w-full columns-1 py-1 space-y-3">
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
					<div
						className={`flex justify-between w-full p-2 shadow-md ${selectedCluster === 'pookiparamba' ? 'bg-sky-200' : 'bg-sky-100'} h-25 border rounded-xl`}
						onClick={() => handleClusterSelection("pookiparamba")}
					>
						<p className="text-xl" style={{fontFamily: 'Liberation Mono, monospace', fontWeight: "lighter", fontSize:"16px"}}>Pookiparamba</p>
						<p className="text-gray-600" style={{fontSize:'14px'}}>contribution :   
							{
								
								` ${userData.filter((user) => user.cluster === "pookiparamba")
									.reduce((total, user) => total + user.contribution,0)}`
								
							}
						</p>
						<p className="text-gray-600" style={{fontSize: '14px'}}>avg :
							{
								`  ${(userData.filter((user) => user.cluster === "pookiparamba")
								.reduce((total, user) => total + user.contribution,0)/6).toFixed(2)}`
							}
						</p>
					</div>
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
					<div
						className={` flex justify-between w-full p-2 shadow-md ${selectedCluster === 'edarikode' ? 'bg-sky-200' : 'bg-sky-100'} h-25 border rounded-xl`}
						onClick={() => handleClusterSelection("edarikode")}
					>
						<p className="text-xl" style={{fontFamily: 'Liberation Mono, monospace', fontWeight: "lighter", fontSize:"16px"}}>Edarikode</p>
						<p className="text-gray-600" style={{fontSize:'14px'}}>contribution :
							{` ${userData.filter((user) => user.cluster === "edarikode")
									.reduce((total, user) => total + user.contribution,0)}`}
						</p>
						<p className="text-gray-600" style={{fontSize: '14px'}}>avg :
							{
								`  ${(userData.filter((user) => user.cluster === "edarikode")
								.reduce((total, user) => total + user.contribution,0)/10).toFixed(2)}`
							}
						</p>
					</div>
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
					<div
						className={`flex justify-between w-full p-2 shadow-md ${selectedCluster === 'kozhichena' ? 'bg-sky-200' : 'bg-sky-100'} h-25 border rounded-xl`}
						onClick={() => handleClusterSelection("kozhichena")}
					>
						<p className="text-xl" style={{fontFamily: 'Liberation Mono, monospace', fontWeight: "lighter", fontSize:"16px"}}>Kozhichena</p>
						<p className="text-gray-600" style={{fontSize:'14px'}}>contribution :
							{` ${userData.filter((user) => user.cluster === "kozhichena")
									.reduce((total, user) => total + user.contribution,0)}`}
						</p>
						<p className="text-gray-600" style={{fontSize:'14px'}}>avg :
							{
								`  ${(userData.filter((user) => user.cluster === "kozhichena")
								.reduce((total, user) => total + user.contribution,0)/7).toFixed(2)}`
							}
						</p>
					</div>
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
					<div
						className={`flex justify-between w-full p-2 shadow-md ${selectedCluster === 'thennala' ? 'bg-sky-200' : 'bg-sky-100'} h-25 border rounded-xl`}
						onClick={() => handleClusterSelection("thennala")}
					>
						<p className="text-xl" style={{fontFamily: 'Liberation Mono, monospace', fontWeight: "lighter", fontSize:"16px"}}>Thennala</p>
						<p className="text-gray-600" style={{fontSize:'14px'}}>contribution :
							{` ${userData.filter((user) => user.cluster === "thennala")
									.reduce((total, user) => total + user.contribution,0)}`}
						</p>
						<p className="text-gray-600" style={{fontSize:'14px'}}>avg :
							{
								`  ${((userData.filter((user) => user.cluster === "thennala")
								.reduce((total, user) => total + user.contribution,0))/8).toFixed(2)}`
							}
						</p>
					</div>
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
					<div
						className={`flex justify-between w-full p-2 shadow-md ${selectedCluster === 'venniyur' ? 'bg-sky-200' : 'bg-sky-100'} h-25 border rounded-xl`}
						onClick={() => handleClusterSelection("venniyur")}
					>
						<p className="text-xl" style={{fontFamily: 'Liberation Mono, monospace', fontWeight: "lighter", fontSize:"16px"}}>Venniyur</p>
						<p className="text-gray-600" style={{fontSize:'14px'}}>contribution :
							{` ${userData.filter((user) => user.cluster === "venniyur")
									.reduce((total, user) => total + user.contribution,0)}`}
						</p>
						<p className="text-gray-600" style={{fontSize:'14px'}}>avg :
							{
								`  ${((userData.filter((user) => user.cluster === "venniyur")
								.reduce((total, user) => total + user.contribution,0))/6).toFixed(2)}`
							}
						</p>
					</div>
				</div>
				<div className="overflow-y-auto w-full max-w-md mt-3">
					{sortedData.map(({ unit, contribution }, index) => (
						<div
							className={`flex justify-between border border-gray-300 rounded-lg p-4 mb-2 shadow-md ${
								index === 0
									? "bg-[#90EE90]"
									: index === 1
									  ? "bg-[#ADD8E6]"
									  : index === 2
										  ? "bg-[#D3D3D3]"
										  : "bg-[#E6E6FA]"
							}`}
							key={unit}
						>
							<p className="text-xl" style={{fontFamily: 'Liberation Mono, monospace', fontWeight: "inherit", fontSize:"16px"}}>{unit.toUpperCase()}</p>
							<p className="text-gray-600">{contribution}</p>
						</div>
					))}
				</div>
				<div className="w-full mt-auto max-w-md bg-sky-100 flex justify-between border border-gray-300 rounded-lg p-4 mb-2 shadow-md">
					<p className="text-xl" style={{fontFamily: 'Liberation Mono, monospace', fontWeight: "inherit", fontSize:"18px"}}>Total Contributions</p>
					<p className="text-gray-600">{totalContributions}</p>
				</div>
				<button
					type="button"
					onClick={handleModal}
					className="bg-sky-500 text-white py-2 px-4 w-full rounded-md hover:bg-sky-700 mb-4"
				>
					Add Your Contribution
				</button>
			</div>
		</div>
	);
}

export default App;
