import type { ResumeFull } from "../types/resumes";
import HeaderText from "./HeaderText";
import {
  CodeXml,
  ExternalLink,
  Lightbulb,
  Mail,
  PhoneCall,
  RefreshCw,
  Star,
  TrendingUp,
  TriangleAlert,
  User,
} from "lucide-react";



type ResultProps = {
  result: ResumeFull,
  handleRefesh: () => void;
};

const Result = ({ result, handleRefesh }: ResultProps) => {
  const {
    name,
    resume_rating,
    ats_score,
    summary,
    phone,
    email,
    linkedin_url,
    strengths,
    improvement_areas,
    upskill_suggestions,
    technical_skills,
    soft_skills
  } = result;

  const areas_to_improve = convertIntoList(improvement_areas);

  function convertIntoList(text: string|null): string[] {
    if (!text) return [];
    return text
      .split(/[,;]+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }



  return (
    <section className="w-full bg-indigo-50/15 max-w-6xl mx-auto p-4">
      <HeaderText />

      <div className="flex flex-col my-6 md:flex-row items-center md:items-center justify-between gap-4 border-b border-b-gray-200 pb-4">
        <div>
          <h1 className="font-bold text-2xl md:text-3xl">Analysis Complete</h1>
          <p className="text-gray-600">Resume analyzed for {name}</p>
        </div>

        <button
          type="button"
          className="inline-flex items-center px-4 py-2 rounded-md border-2 border-indigo-600 text-indigo-600 font-semibold text-base hover:bg-indigo-600 hover:text-white transition-colors"
        
          onClick={handleRefesh}
        >
          <RefreshCw size={18} className="mr-2" />
          <span>Analyze Another</span>
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col items-center text-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div
            className={[
              "mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full border-2 text-center",
              resume_rating >= 6
                ? "border-green-300 bg-green-50 text-green-700"
                : "border-red-300 bg-red-50 text-red-700",
            ].join(" ")}
            aria-label={`Overall rating ${resume_rating} out of 10`}
          >
            <span className="text-3xl font-bold">{resume_rating}/10</span>
          </div>

          <h2 className="text-2xl font-semibold">Overall Rating</h2>
          <p className="mt-2 max-w-prose text-sm text-gray-600">{summary}</p>
        </div>

        <div className="flex flex-col items-center text-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div
            className={[
              "mb-4 inline-flex   ",
              ats_score >= 60 ? "  text-green-600" : " text-red-600",
            ].join(" ")}
            aria-label={`ATS score ${ats_score} out of 100`}
          >
            <TrendingUp size={32} />
          </div>

          <h2 className="text-2xl font-semibold">ATS Score</h2>
          <p
            className={[
              "mt-1 text-3xl font-bold",
              ats_score >= 60 ? "text-green-600" : "text-red-600",
            ].join(" ")}
          >
            {ats_score}/100
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Applicant Tracking System compatibility
          </p>
        </div>
      </div>

      <div className="  my-6  rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center">
          <User />
          <h1 className="ml-2 text-2xl font-semibold ">Personal Details</h1>
        </div>

        <div className="  my-6 grid md:grid-cols-2 gap-6 ">
          <div>
            <p className="text-gray-600 font-medium">Name</p>
            <p>{name}</p>
            <p className="flex items-center mt-2">
              <PhoneCall size={18} className="mr-2" /> {phone}
            </p>
          </div>

          <div>
            <a href={`mailto:${email}`} className="flex items-center">
              <Mail size={18} className="mr-2" />
              <span className="hover:text-indigo-600 hover:underline">
                {email}
              </span>
            </a>
            <a
              href={`${linkedin_url}`}
              className="flex items-center mt-3"
              target="_blank"
            >
              <ExternalLink size={18} className="mr-2" />
              <span className="hover:text-indigo-600 hover:underline">
                Linkedin Profile
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="  my-6  rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
          <h1 className="flex items-center text-green-800">
            <Star />{" "}
            <span className="ml-2 text-2xl font-semibold ">Strengths</span>{" "}
          </h1>

          <ul className="list-disc my-6 px-6 marker:text-green-400 ">
            {strengths.map((item: string, idx: number) => (
              <li className="my-3" key={idx}>
              {item}.
              </li>
            ))}
          </ul>
        </div>

        <div className="my-6  rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <h1 className="flex items-center text-amber-800">
            <TriangleAlert />{" "}
            <span className="ml-2 text-2xl font-semibold ">
              Areas to Improve
            </span>{" "}
          </h1>

          <ul className="list-disc my-6 px-6 marker:text-amber-400 ">
            {areas_to_improve.map((item, idx) => (
              <li className="my-3" key={idx}>
                {item}.{" "}
              </li>
            ))}
          </ul>
        </div>

        <div className="my-6  rounded-2xl border border-indigo-200 bg-indigo-50 p-6 shadow-sm">
          <h1 className="flex items-center text-indigo-800">
            <Lightbulb />{" "}
            <span className="ml-2 text-2xl font-semibold ">
              Suggested Skills
            </span>{" "}
          </h1>

          <ul className="flex flex-wrap gap-3 my-6 ">
            {upskill_suggestions.map((item: string, idx: number) => (
              <li
              key={idx}
              className="px-3 py-1 rounded-3xl text-indigo-600 font-semibold bg-indigo-200"
              >
              {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="my-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

  <div className="flex items-center gap-2 mb-4">
    <CodeXml className="w-6 h-6 text-gray-700" />
    <h1 className="text-2xl font-semibold text-gray-800">Skills Identified</h1>
  </div>


  <div className="mb-6">
    <h2 className="text-lg font-semibold text-gray-700 mb-3">Technical Skills</h2>
    <ul className="flex flex-wrap gap-3">
      {technical_skills.map((item: string, idx: number) => (
        <li
          key={idx}
          className="px-3 py-1 rounded-3xl bg-indigo-100 text-indigo-700 font-medium text-sm"
        >
          {item}
        </li>
      ))}
    </ul>
  </div>


  <div>
    <h2 className="text-lg font-semibold text-gray-700 mb-3">Soft Skills</h2>
    <ul className="flex flex-wrap gap-3">
      {soft_skills.map((item: string, idx: number) => (
        <li
          key={idx}
          className="px-3 py-1 rounded-3xl bg-emerald-100 text-emerald-700 font-medium text-sm"
        >
          {item}
        </li>
      ))}
    </ul>
  </div>
</div>

      


    </section>
  );
};

export default Result;
