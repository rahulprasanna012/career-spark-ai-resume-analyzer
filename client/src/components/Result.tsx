import HeaderText from './HeaderText';
import { RefreshCw } from 'lucide-react';

const Result = ({result}:any) => {

    const {name}=result

    console.log(result);
    
  return (
     <section className="w-full bg-white max-w-6xl mx-auto p-4">
        <HeaderText/>

        <div className='flex flex-col md:flex-row items-center justify-between'>
            <div className='mb-6 md:mb-0'>
                <h1 className='font-bold md:text-3xl'>Analyzsis Complete</h1>
                <p className='text-gray-600'> Resume analyzed for {name}</p>

            </div>

            <button className='flex items-center font-semibold p-2 rounded-md hover:text-white border-2 cursor-pointer hover:bg-indigo-600 hover:border-0'>
                <RefreshCw size={16} />
                
                <span className='text-lg ml-1'>Analyze Another</span>
            </button>


        </div>

        <div>
            <div>


            </div>


        </div>




     </section>
  )
}

export default Result