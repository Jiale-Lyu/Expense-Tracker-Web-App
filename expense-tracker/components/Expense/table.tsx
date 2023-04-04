// import data from '../database/data.json'
import { getUser } from "../../lib/helper"
import {useQuery } from "react-query";

import { useSelector, useDispatch } from 'react-redux'
import { toggleChangeAction, updateAction, deleteAction  } from '../../redux/reducer'
import Tr from "./tr"


export default function Table(){    
    const { isLoading , isError ,data, error } = useQuery('users',getUser)
    // setTimeout(() => {
     console.log("data:",data);

    // }, 10000);
    // if(isLoading) return <div>Employee is loading.....</div>;
    // if(isError)return <div>Got error {error}</div>

    
    return(
        <table className="min-w-full table-auto">
            <thead>
                <tr className="bg-gray-800">
                    <th className="px-16 py-2">
                        <span className="text-gray-200">Name</span>
                    </th>
                    <th className="px-16 py-2">
                        <span className="text-gray-200">Email</span>
                    </th>
                    <th className="px-16 py-2">
                        <span className="text-gray-200">Salary</span>
                    </th>
                    <th className="px-16 py-2">
                        <span className="text-gray-200">Birthday</span>
                    </th>
                    <th className="px-16 py-2">
                        <span className="text-gray-200">Status</span>
                    </th>
                    <th className="px-16 py-2">
                        <span className="text-gray-200">Actions</span>
                    </th>
                </tr>

            </thead>
            

            <tbody className="bg-gray-200">
            

              {/* {
              data.message.map((obj:any,i:any)=>
                <Tr {...obj} key={i}/>)
              } */}

            </tbody>
        </table>
    )

}

