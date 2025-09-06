import type { FC, ReactElement, ReactNode } from "react"

type ButtonTypes={

  label:string,
  loading:boolean,
  type:"submit" | "reset" | "button" | undefined,
  handleClick:()=>void
}

const Button:FC<ButtonTypes>=({ label, loading = false,type,handleClick  }) => (
    <button
    onClick={handleClick}
      type={type}
      disabled={loading}
      className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
        loading ? 'opacity-70 cursor-not-allowed' : ''
      }`}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      ) : (
        <span>{label}</span>
      )}
    </button>
  )


export default  Button