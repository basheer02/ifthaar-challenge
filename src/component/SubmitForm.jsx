import { useState } from "react";
import { db } from "../../lib/firebase";
import {collection, addDoc} from 'firebase/firestore'

import { unitDatas } from "./unitDatas";
import { unitID } from "./UnitLogin";



function SubmitForm({ closeModal, onNewContribution }) {
	const [name, setName] = useState("");
	const unit = unitDatas[unitID][0]
	const cluster = unitDatas[unitID][1];
	const [count, setCount] = useState(1);
	const [phone, setPhone] = useState("")

	const handleSubmit = async (e) => {
		e.preventDefault();
		closeModal();
		try {
			const submittedAt = new Date().toISOString();
			const docRef = await addDoc(collection(db, "test-db1"), {
				name: name,
				phone: phone,
				unit: unit,
				cluster: cluster,
				contribution: count,
				submittedAt: submittedAt
			})
			alert("Contribution submitted successfully!");
			onNewContribution();
		} catch (error) {
			console.error("Error submitting form:", error);
			alert("An error occurred. Please try again later.");
		} finally {
			setName("");
			setPhone("")
			setCount(0);
		}
	};


	return (
		<form
			onSubmit={handleSubmit}
			className="bg-white w-full rounded-lg shadow-md px-8 py-10"
		>
			<center><h3 className="text-l" style={{fontFamily: 'Liberation Mono, monospace', fontWeight: "inherit", fontSize:"22px"}}>Add Details</h3></center>
			<label htmlFor="name" className="flex items-center mb-2 mt-5">
				<input
					placeholder="Enter name"
					type="text"
					name="name"
					required
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-sky-500"
				/>
			</label>
			<label htmlFor="phone" className="flex items-center mb-2">
				<input
					placeholder="Enter phone number"
					type="tel"
					name="phone"
					required
					value={phone}
					onChange={(e) => setPhone(e.target.value)}
					className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-sky-500"
				/>
			</label>
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
			{/*<label htmlFor="cluster" className="flex items-center mb-2">
				<select
					name="cluster"
					value={cluster}
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
			<label htmlFor="unit" className="flex items-center mb-2">
				<select
					name="unit"
					required
					value={unit}
					onChange={(e) => setUnit(e.target.value)}
					className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-sky-500"
				>
					<option disabled value="ph">Select Unit</option>
                    {unitList[cluster]?.map((unitName) => (
                        <option key={unitName.toLowerCase()} value={unitName.toLowerCase()}>{unitName}</option>
                    ))}
				</select>
					</label> */}
			<div className="flex items-center justify-center">
				<p className="pr-2">Contribution: </p>
				<button
					type="button"
					onClick={() => setCount((prevCount) => Math.max(prevCount - 1, 1))}
					className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-2 w-8 h-8 rounded-lg focus:outline-none"
				>
					-
				</button>
				<span className="mx-2 text-md">{count}</span>
				<button
					type="button"
					onClick={() => setCount((prevCount) => prevCount + 1)}
					className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-8 h-8 py-1 px-2 rounded-lg focus:outline-none"
				>
					+
				</button>
			</div>
			<input type="hidden" name="contribution" value={count} />
			<div className="flex justify-end mt-4">
				<button
					type="button"
					onClick={closeModal}
					className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none"
				>
					Cancel
				</button>
				<button
					type="submit"
					name="submit"
					className="ml-4 bg-sky-500 text-white py-2 px-4 rounded-md hover:bg-sky-700"
				>
					Submit
				</button>
			</div>
		</form>
	);
}

export default SubmitForm;
