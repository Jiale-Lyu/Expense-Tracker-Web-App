

export default function Success({messsage}){
    return(
        <div className="success conatiner mx-auto">
            <div className="flex justify-center mx-auto border border-yellow-200 bg-yellow-400 w-3/6 text-gray-900 text-md my-4 py-2 text-center bg-opaciy-5 ">
               {messsage}
            </div>
        </div>
    )
}