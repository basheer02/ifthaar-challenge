import { useState,useRef } from "react";

import { unitDatas } from "./unitDatas";

export let unitLogined = false;
export let unitID = 0;


function UnitLogin({closeModal}) {

    const [unitId,setUnitId] = useState('');
    const [password,setPassword] = useState('');


    const unitRef = useRef(null);
    const passRef = useRef(null);

    const handleSubmit = (e) => {
        if(unitId in unitDatas){
            if(password === unitDatas[unitId][2]){
                unitLogined = true;
				unitID = unitId;
                alert(' Login Successfull');
                closeModal();
            }else{
                alert(' Incorrect password');
                passRef.current.focus();
            }
        }else{
            alert(' Incorrect Unit ID');
            unitRef.current.focus();
        }
    }

    return(
        <div className="bg-white w-full rounded-lg shadow-md px-8 py-10">
            <center><h3 className="text-l" style={{fontFamily: 'Liberation Mono, monospace', fontWeight: "inherit", fontSize:"22px"}}>Login</h3></center>
			<label htmlFor="unitId" className="flex items-center mb-2 mt-5">
				<input
                    ref={unitRef}
					placeholder="Enter unit number"
					type="text"
					name="unitId"
					required
					value={unitId}
					onChange={(e) => setUnitId(e.target.value)}
					className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-sky-500"
				/>
			</label>
			<label htmlFor="password" className="flex items-center mb-2">
				<input
                    ref={passRef}
					placeholder="Enter password"
					type="password"
					name="pass"
					required
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:border-sky-500"
				/>
			</label>
			<div className="flex justify-end mt-4">
				<button
					type="button"
					onClick={closeModal}
					className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none"
				>
					Cancel
				</button>
				<button
					type="button"
					name="submit"
                    onClick={handleSubmit}
					className="ml-4 bg-sky-500 text-white py-2 px-4 rounded-md hover:bg-sky-700"
				>
					Login
				</button>
			</div>
		</div>
    )
}

export default UnitLogin;