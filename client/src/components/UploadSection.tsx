import { FileText } from 'lucide-react';
import React from 'react'
import HeaderText from './HeaderText';


type UploadTypes={
    dragOver:boolean,
    onDrop:(e: React.DragEvent<HTMLDivElement>)=>void,
    onDragOver:(e: React.DragEvent<HTMLDivElement>)=>void,
    onDragLeave:(e: React.DragEvent<HTMLDivElement>)=>void,
    openPicker:()=>void,
    fileName:string,
    error:string,
    inputRef:React.RefObject<HTMLInputElement | null>,
    handlePick:(files: FileList | null)=>void
}



const UploadSection:React.FC<UploadTypes> = ({dragOver,onDrop,onDragOver,onDragLeave,openPicker,fileName,error,inputRef,handlePick}) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
        <HeaderText/>


      <div
        className={[
          "rounded-2xl border-2 border-dashed transition-colors bg-white/70 backdrop-blur-sm",
          dragOver ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300",
        ].join(" ")}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <div className="flex flex-col items-center text-center px-6 py-16">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-sm">
            <FileText size={32} />
          </div>

          <h2 className="mt-6 text-2xl font-semibold text-gray-900">Upload Your Resume</h2>
          <p className="mt-2 max-w-xl text-sm text-gray-600">
            Drop a PDF file here or click the button to browse. Get instant AI-powered analysis and feedback.
          </p>

          <button
            type="button"
            onClick={(e) => { e.preventDefault(); openPicker(); }}
            className="mt-6 inline-flex items-center px-5 py-2.5 rounded-lg bg-gradient-to-r cursor-pointer from-blue-600 to-indigo-700 text-white font-medium shadow-sm hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Choose File
          </button>

          <p className="mt-3 text-xs text-gray-500">Supports PDF files up to 10MB</p>
          {fileName && <p className="mt-1 text-sm text-gray-700">Selected: <span className="font-medium">{fileName}</span></p>}
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>

        <input
          ref={inputRef}
          id="resumeInput"
          type="file"
          accept="application/pdf"
          hidden
          onChange={(e) => handlePick(e.target.files)}
        />
      </div>
    </div>
  )
}

export default UploadSection