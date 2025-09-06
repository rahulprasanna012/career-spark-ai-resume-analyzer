import fs from "fs";
import pdfParse from "pdf-parse";

const buffer = fs.readFileSync("./sample.pdf"); // file must exist
pdfParse(buffer).then(({ text }) => {
  console.log("Extracted text (first 300 chars):\n", text.slice(0, 300));
}).catch(err => {
  console.error("pdf-parse error:", err);
});
