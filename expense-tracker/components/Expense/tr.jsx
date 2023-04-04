import { getUser } from "../../lib/helper"
import {useQuery } from "react-query";

import { useSelector, useDispatch } from 'react-redux'
import { toggleChangeAction, updateAction, deleteAction  } from '../../redux/reducer'
export default function Tr({name,category,description,date,status}){
    
    // const visible = useSelector((state)=> state.app.client.toggleForm)
    const { isLoading , isError ,data, error } =useQuery('users',getUser)
    
    const dispatch = useDispatch()

    
    const onUpdate=()=>{
        // dispatch(toggleChangeAction(_id))
       
        // if(visible){
        //     dispatch(updateAction(_id))
        // }

    }

    const onDelete=() =>{
        // if(!visible){
        //     dispatch(deleteAction(_id))
        // }
    }
    return(
        <tr className="bg-gray-50 text-center">

        <td className="px-16 py-2 flex flex-row items-center">
            <span className="text-center ml-2 font-semibold">{name||"unknown"}</span>
        </td>
        <td className="px-6 py-2">
            <span>{category||"unknown"}</span>
        </td>
        <td className="px-6 py-2">
            <span>{description||"unknown"}</span>
        </td>
        <td className="px-6 py-2">
            <span>{date||"unknown"}</span>
        </td>
        <td className="px-6 py-2">
            <button className="cursor"><span className="bg-green-500 text-white px-5 py-1 rounded">{status||"unknown"}</span></button>
        </td>
        <td className="px-6 py-2">
            <button className="cursor" onClick={onUpdate} ><span className="bg-green-500 text-white px-5 py-1 rounded">Update</span></button>
            <button className="cursor" onClick={onDelete}><span className="bg-green-500 text-white px-5 py-1 rounded">{"Delete"}</span></button>
        </td>
    </tr>
    )
    
}