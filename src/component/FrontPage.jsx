import { useState,useEffect } from "react";
import { Link } from 'react-router-dom'; // Import Link if using React Router
import IMAGES from '../images/Images';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const styles = {
    card: {
      backgroundColor: 'skyblue',
      color: 'white',
      padding: '15px',
      height: '60px',
      margin:'5px',
      borderRadius: '15px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    link: {
      color: 'inherit',
      textDecoration: 'none',
      fontWeight: 'bold',
      fontSize: '16px'
    },
  };

  async function fetchDataFromFirestore() {
    const querySnapshot = await getDocs(collection(db, "test-db1"));
    const userData = [];
    for (const doc of querySnapshot.docs) {
      userData.push({ id: doc.id, ...doc.data() });
    }
    return userData;
  }


  
  function FrontPage() {

    const [userData, setUserData] = useState([]);

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

    const aggregatedData = {};
	  // biome-ignore lint/complexity/noForEach: <explanation>
	  userData.forEach((user) => {
	  	if (!aggregatedData[user.unit]) {
	  		aggregatedData[user.unit] = 0;
	  	}
	  	aggregatedData[user.unit] += user.contribution;
	  });

    const topData = Object.entries(aggregatedData);
    topData.sort((a,b) =>  b[1] - a[1]);

    const data = topData.slice(0,10);



    /*const convertToExcel = () => {

      const sortedData = [...userData].sort((a, b) => {
        // First sort by 'cluster'
        const clusterComparison = a.cluster.localeCompare(b.cluster);
        if (clusterComparison !== 0) {
        return clusterComparison;
        }
        
        // If 'cluster' values are equal, then sort by 'unit' within the cluster
        return a.unit.localeCompare(b.unit);
      });
    
    
      const formattedData = sortedData.map(item => ({
        Cluster: item.cluster,
        Unit: item.unit,
        Name: item.name,
        Phone: item.phone,
        Contribution: item.contribution
      }));
    
      const ws = XLSX.utils.json_to_sheet(formattedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      const excelBuffer = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
      saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'data.xlsx');
      };*/


    return (
      <div className="flex flex-col w-screen h-screen lg:w-2/3 xl:w-1/3 mx-auto shadow-md bg-sky-100 p-2">
        <img src={IMAGES.image1} alt="Welcome" style={{height: '400px', padding: '1px', border: 'rounded', borderRadius: '10px'}} />
        {userData && userData.length > 0 && (<div className="flex flex-col bg-white w-full rounded-lg items-center overflow-hidden shadow-md mb-4 mt-3 p-5 px-4 flex-grow">
          <center><p style={{fontFamily: 'Liberation Mono, monospace', fontWeight: "inherit", fontSize:"18px"}}>Top 10 Units</p></center>
          <div className="overflow-y-auto w-full max-w-md mt-3">
              {data.map((value, index) => (
                  <div
        		className={` flex justify-between border border-gray-300 rounded-lg p-4 mb-4 shadow-md ${
              index === 0 ? "bg-[#90EE90]" :
              index === 1 ? "bg-[#ADD8E6]" :
              index === 2 ? "bg-[#D3D3D3]" :
              "bg-[#E6E6FA]" /* Default background color */
            }`}
        	key={value[0]}
                  > 
                  <div className="flex-1"> <p className="text-xl" style={{fontFamily: 'Liberation Mono, monospace', fontWeight: "lighter", fontSize:"15px"}}>{value[0].toUpperCase()}</p></div>
                  <p className="text-gray-600">{value[1]}</p>
                  </div>
              ))}
          </div>
        </div>)}
        <div style={styles.card}>
          <Link to="/home" style={styles.link}>
            Take Challenge    {'>>>'}
          </Link>
        </div>
        {/*<div style={styles.card}>
          <button onClick={convertToExcel}>Download Excel</button>
          </div>*/}
      </div>
    );
  }
  

export default FrontPage;
