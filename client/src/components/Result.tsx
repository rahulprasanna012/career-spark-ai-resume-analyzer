import HeaderText from "./HeaderText";
import { ExternalLink, Mail, PhoneCall, RefreshCw, TrendingUp, User } from "lucide-react";

const result = {
  id: 10,
  user_id: 1,
  file_name: "Prasanna_2025-06-11-172559.pdf",
  uploaded_at: "2025-09-06T18:21:25.675Z",
  name: "Prasanna S",
  email: "rahulprasanna012@gmail.com",
  phone: "6380258932",
  linkedin_url: "https://www.linkedin.com/in/prasanna-samson/",
  portfolio_url: "https://github.com/rahulprasanna012",
  summary:
    "A highly motivated and results-oriented full-stack developer with proven experience in building web applications and e-commerce platforms.  Proficient in React, Node.js, Python, and various other technologies, seeking a challenging role to leverage skills and contribute to innovative projects.  Demonstrated leadership and teamwork abilities through successful project completion.",
  work_experience: [
    {
      role: "Application Developer Intern",
      company: "XYLOINC",
      duration: "Jul 2024 - Oct 2024",
      description: [
        "Developed an innovative e-learning platform using React.js, Tailwind CSS, and Firebase, enhancing user engagement.",
        "Led a team of five in planning and architecting the Idzone project, a comprehensive digital identity management system utilizing Reactjs and Tailwind CSS.",
        "Gained hands-on experience with modern web technologies and frameworks, significantly enhancing development skills and team collaboration capabilities.",
      ],
    },
  ],
  education: [
    {
      degree: "BE (Bachelor of Engineering)_Computer Science Engineering (CSE)",
      institution:
        "Coimbatore Institute of Engineering and Technology, Coimbatore",
      graduation_year: "2025",
    },
    {
      degree: "Industry Ready Certification in Full-stack Development",
      institution: "Nxtwave Disruptive Technologies",
      graduation_year: "Ongoing",
    },
  ],
  technical_skills: [
    "HTML",
    "CSS",
    "Bootstrap",
    "JavaScript",
    "React.js",
    "Python",
    "Express",
    "Node.js",
    "SQLite",
    "Flexbox",
    "Git",
    "OOPs",
    "Tailwind CSS",
    "Firebase",
    "JWT",
    "REST API",
  ],
  soft_skills: [
    "Leadership",
    "Teamwork",
    "Problem-solving",
    "Communication",
    "Time Management",
  ],
  projects: [
    {
      tech: [
        "React JS",
        "JavaScript",
        "CSS",
        "Bootstrap",
        "Routing",
        "REST API Calls",
        "Local Storage",
        "JWT Token",
        "Authorization",
        "Authentication",
      ],
      title: "Nxt Watch",
      summary:
        "Built a YouTube clone application enabling user login, video exploration, and content search with theme adjustments.",
    },
    {
      tech: [
        "React JS",
        "JS",
        "CSS",
        "Bootstrap",
        "Routing",
        "REST API Calls",
        "Local Storage",
        "JWT Token",
        "Authorization",
        "Authentication",
      ],
      title: "Nxt Trendz (ECommerce Clone)",
      summary:
        "Developed an e-commerce platform with features for login, product browsing, and detailed views.",
    },
    {
      tech: ["HTML", "CSS", "Bootstrap"],
      title: "Food Munch",
      summary:
        "Created a responsive website showcasing food items with product videos.",
    },
    {
      tech: [
        "Python",
        "SpeechRecognition",
        "pyttsx3",
        "gTTS",
        "Webbrowser",
        "Requests",
        "REST API integration (Wikipedia, Weather, News)",
      ],
      title: "Voice Assistant Using Python",
      summary:
        "Developed a voice-controlled personal assistant automating tasks and responding conversationally.",
    },
  ],
  certifications: ["Industry Ready Certification in Full-stack Development"],
  resume_rating: 8,
  improvement_areas:
    "Expand backend technology experience beyond Node.js and Python; Showcase more complex projects demonstrating advanced concepts",
  upskill_suggestions: ["AWS", "Docker", "Testing frameworks (Jest, Cypress)"],
  strengths: [
    "Strong full-stack development skills",
    "Successful project completion record",
    "Demonstrated leadership and teamwork abilities",
  ],
  ats_score: 85,
};

const Result = () => {
  const { name, resume_rating, ats_score, summary,phone,email,linkedin_url } = result;

  console.log(result);

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
                    <User/>
                    <h1 className="ml-2 text-2xl font-semibold ">Personal Details</h1>

            </div>
            
            <div className="  my-6 grid md:grid-cols-2 gap-6 ">
                    <div>
                <p className="text-gray-600 font-medium">Name</p>
                <p >{name}</p>
                <p className="flex items-center mt-2"><PhoneCall size={18} className="mr-2"/> {phone}</p>
            </div>

            <div>
                <a href={`mailto:${email}`} className="flex items-center">
                    <Mail size={18} className="mr-2"/>
                    <span className="hover:text-indigo-600 hover:underline">{email}</span>


                </a>
                 <a href={`${linkedin_url}`} className="flex items-center mt-3" target="_blank">
                    <ExternalLink size={18} className="mr-2"/>
                    <span className="hover:text-indigo-600 hover:underline">Linkedin Profile</span>


                </a>

            </div>
            </div>
            


        </div>

    </section>
  );
};

export default Result;
