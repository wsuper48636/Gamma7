// Fixed-path document "slots" used by the self-serve upload feature.
// Each slot always lives at the same storage path regardless of what the
// uploaded file was originally named, so public links to it (the
// Download buttons on scientific-verification, the certificate link on
// about) can be hardcoded before anything has ever been uploaded.
export const BUCKET = "documents";

export const DOCUMENT_SLOTS = {
  "complete-research-summary": {
    label: "Complete Research Summary",
    path: "complete-research-summary.pdf",
  },
  "statistical-analysis-report": {
    label: "Statistical Analysis Report",
    path: "statistical-analysis-report.pdf",
  },
  "scientific-bibliography": {
    label: "Scientific Bibliography",
    path: "scientific-bibliography.pdf",
  },
  "guinness-certificate": {
    label: "Russian Guinness Book of Records Certificate",
    path: "guinness-certificate.pdf",
  },
};
