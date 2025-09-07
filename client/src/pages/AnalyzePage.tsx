import React, { useRef, useState, useCallback } from "react";
import api from "../utils/api";

import Loader from "../components/Loader";
import Result from "../components/Result";
import UploadSection from "../components/UploadSection";

export default function ResumeUploader() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);



  const openPicker = () => inputRef.current?.click();

  const validate = (file: File) => {
    setError("");
    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File exceeds 10MB limit.");
      return false;
    }
    return true;
  };

  const upload = async (file: File) => {
    setLoading(true);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("resume", file);
      const res = await api.post("/resumes/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
      localStorage.setItem('result',res.data)
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err?.response?.data?.error || err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePick = (files: FileList | null) => {
    if (!files?.length) return;
    const file = files[0];
    if (!validate(file)) return;
    setFileName(file.name);
    upload(file);
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    handlePick(e.dataTransfer.files);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);


  const handleRefesh=()=>{
      setResult(null)
      setFileName("")

  }

  // Loading state
  if (loading)return <Loader/>

  // Result state (simplified)
  if (result) return <Result  result={result} handleRefesh={handleRefesh}/>
  

  // Upload card
  return (
    <UploadSection dragOver={dragOver} 
    error={error} fileName={fileName} 
    handlePick={handlePick} inputRef={inputRef} 
    onDragLeave={onDragLeave} onDragOver={onDragOver}
    onDrop={onDrop}
    openPicker={openPicker}
    
    />
  );
}
