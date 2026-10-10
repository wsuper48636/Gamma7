// Fixed-path document "slots" used by the self-serve upload feature.
// Each slot always lives at the same storage path regardless of what the
// uploaded file was originally named, so public links to it (the
// Download buttons on research-results, the certificate link on
// about) can be hardcoded before anything has ever been uploaded.
export const BUCKET = "documents";

export const DOCUMENT_SLOTS = {
  "study-sleep-rmit-2024": {
    label: "Does Radiofrequency Radiation Impact Sleep? (RMIT University, 2024)",
    path: "study-sleep-rmit-2024.pdf",
  },
  "study-dna-ntp-2020": {
    label: "RFR Genotoxicity Study (US National Toxicology Program, 2020)",
    path: "study-dna-ntp-2020.pdf",
  },
  "study-dna-evidence-map-2025": {
    label: "RFR and DNA Damage Evidence Map (Griffith University, 2025)",
    path: "study-dna-evidence-map-2025.pdf",
  },
  "study-huss-2007": {
    label: "Huss et al., Source of Funding and Results of Studies (2007)",
    path: "study-huss-2007.pdf",
  },
  "study-starkey-2016": {
    label: "Starkey, Inconsistencies in UK EMF Exposure Guidance (2016)",
    path: "study-starkey-2016.pdf",
  },
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
  "effectiveness-doc-01": {
    label: "Conclusion on research into the effectiveness of the \"Gamma-7-Activator\" product, dated 10.06.2013",
    path: "effectiveness-doc-01.pdf",
  },
  "effectiveness-doc-02": {
    label: "CONCLUSION on the results of \"Express assessment of human psychophysiological reactions to a single short-term exposure to the 'Gamma-7.A' device\"",
    path: "effectiveness-doc-02.pdf",
  },
  "effectiveness-doc-03": {
    label: "Conclusion evaluating the protective effect of \"Gamma-7.N, RT\" products against electromagnetic radiation (e.g. from mobile and cordless phones, computers, displays and similar sources). International Society for Electrosmog Research (IGEF), 18.07.2004",
    path: "effectiveness-doc-03.pdf",
  },
  "effectiveness-doc-04": {
    label: "Conclusion of the Multisystem Research Laboratory, Research Institute of General Pathology and Pathophysiology of the Russian Academy of Medical Sciences, on experimental studies of biological reactions to sublethal doses of gamma radiation combined with \"Gamma-7\" devices. Dated 19.01.2012",
    path: "effectiveness-doc-04.pdf",
  },
  "effectiveness-doc-05": {
    label: "Research report: \"Experimental studies of the effect of the 'Gamma-7.N' neutralizer on nicotine preference development in mice.\" Dated 11.2012",
    path: "effectiveness-doc-05.pdf",
  },
  "effectiveness-doc-06": {
    label: "Expert opinion on product compliance with the Unified Sanitary-Epidemiological and Hygienic Requirements for goods, dated 11.08.2011",
    path: "effectiveness-doc-06.pdf",
  },
  "effectiveness-doc-07": {
    label: "CONCLUSION on the comparative effectiveness of combined use of \"Gamma-7.N\" and \"Gamma-7.N-RT\" neutralizers. Dated 21.01.2011",
    path: "effectiveness-doc-07.pdf",
  },
  "effectiveness-doc-08": {
    label: "CONCLUSION on the effectiveness of long-term use of the \"Gamma-7N-RT\" neutralizer. Dated 09.09.2009",
    path: "effectiveness-doc-08.pdf",
  },
  "effectiveness-doc-09": {
    label: "CONCLUSION on research conducted at the Department of Medical Psychology and Psychophysiology. Dated 09.04.2009",
    path: "effectiveness-doc-09.pdf",
  },
  "effectiveness-doc-10": {
    label: "CONCLUSION on the effectiveness of prolonged use of the \"Gamma-7.N-RT\" neutralizer. Dated 05.01.2009",
    path: "effectiveness-doc-10.pdf",
  },
  "effectiveness-doc-11": {
    label: "CONCLUSION on the effectiveness of \"Gamma-7.N-RT\" neutralizers in harmonizing the biological effect of man-made cordless phone radiation on children and adolescents (original in German). Dated 10.05.2008",
    path: "effectiveness-doc-11.pdf",
  },
  "effectiveness-doc-12": {
    label: "CONCLUSION on the effectiveness of \"Gamma-7.N-RT\" neutralizers in harmonizing the biological effect of man-made cordless phone radiation on children and adolescents. Dated 10.05.2008",
    path: "effectiveness-doc-12.pdf",
  },
  "effectiveness-doc-13": {
    label: "CONCLUSION of the commission on the experimental study of the radio-modifying properties of \"Gamma-7.N\" neutralizers. Dated 17.03.2008",
    path: "effectiveness-doc-13.pdf",
  },
  "effectiveness-doc-14": {
    label: "CONCLUSION: \"Assessment of the effectiveness of protecting an operator from an acoustic field simulating the circulation of sound sources.\" Dated 12.03.2008",
    path: "effectiveness-doc-14.pdf",
  },
  "effectiveness-doc-15": {
    label: "CONCLUSION OF THE COMMISSION on the experimental study of the radio-modifying properties of \"GAMMA-7.N\" neutralizers. Dated 21.08.2007",
    path: "effectiveness-doc-15.pdf",
  },
  "effectiveness-doc-16": {
    label: "SANITARY-EPIDEMIOLOGICAL CONCLUSION, dated 28.12.2006",
    path: "effectiveness-doc-16.pdf",
  },
  "effectiveness-doc-17": {
    label: "Conclusion on research into the harmonizing effect of the Gamma 7.N neutralizer on the human body exposed to electromagnetic radiation and harmful geobiological fields. Dated 17.12.2006",
    path: "effectiveness-doc-17.pdf",
  },
  "effectiveness-doc-18": {
    label: "Conclusion of Multidisciplinary Hospital No. 2, St. Petersburg, 12.05.2006",
    path: "effectiveness-doc-18.pdf",
  },
  "effectiveness-doc-19": {
    label: "State Sanitary-Epidemiological Service of the Russian Federation (N, Nrt), dated 29.12.2003",
    path: "effectiveness-doc-19.pdf",
  },
  "effectiveness-doc-20": {
    label: "Expert opinion on the scientific examination of the protective properties of GAMMA-7.N products during prolonged work with video display terminals, dated 25.12.2003",
    path: "effectiveness-doc-20.pdf",
  },
  "effectiveness-doc-21": {
    label: "Expert opinion on the scientific examination of the protective properties of GAMMA-7.N-RT products during prolonged cell phone use, dated 25.12.2003",
    path: "effectiveness-doc-21.pdf",
  },
  "effectiveness-doc-22": {
    label: "MINISTRY OF PHYSICAL CULTURE AND SPORT OF THE RUSSIAN FEDERATION. Conclusion on the results of research work, dated 26.06.2003",
    path: "effectiveness-doc-22.pdf",
  },
  "effectiveness-doc-23": {
    label: "Commission conclusion on research into the effectiveness of the protective properties of Gamma-7.N and Gamma-7.N-RT products, dated 20.12.2002",
    path: "effectiveness-doc-23.pdf",
  },
  "effectiveness-doc-24": {
    label: "MINISTRY OF PHYSICAL CULTURE, SPORT AND TOURISM OF THE RUSSIAN FEDERATION. ANNOTATED CONCLUSION, dated 23.05.2002",
    path: "effectiveness-doc-24.pdf",
  },
  "effectiveness-doc-25": {
    label: "Conclusion on research into the physiological and psychological effects of the Gamma-7.N-IZ device used by combat-sport athletes, dated 31.01.2002",
    path: "effectiveness-doc-25.pdf",
  },
  "effectiveness-doc-26": {
    label: "Conclusion from the State Unitary Enterprise Central Research Institute of Clothing Industry (TsNIIKP), jointly with Moscow State University of Design and Technology and the Gamma-7 Informatics Center, dated 21.12.2001",
    path: "effectiveness-doc-26.pdf",
  },
  "effectiveness-doc-27": {
    label: "Conclusion on research into the physiological and psychological effects of long-term use of the Gamma-7.N-IZ device by athletes, dated 05.03.2001",
    path: "effectiveness-doc-27.pdf",
  },
  "effectiveness-doc-28": {
    label: "Conclusion on research into the physiological and psychological effects of long-term use of the Gamma-7.N-IZ device by female athletes, dated 06.07.2001",
    path: "effectiveness-doc-28.pdf",
  },
  "effectiveness-doc-29": {
    label: "Conclusion on the experimental and clinical-physiological evaluation of the Gamma-7.N neutralizer as a means of mitigating negative effects, dated 27.01.2000",
    path: "effectiveness-doc-29.pdf",
  },
  "effectiveness-doc-30": {
    label: "Research Institute (BINAR), conclusion dated 22.12.2000",
    path: "effectiveness-doc-30.pdf",
  },
  "effectiveness-doc-31": {
    label: "M.M. Gromov Flight Research Institute: report of control tests for overload tolerance of the GAMMA-7.N neutralizer, dated 15.06.2000",
    path: "effectiveness-doc-31.pdf",
  },
  "effectiveness-doc-32": {
    label: "REPORT OF CONTROL TESTS FOR EXTERNAL EXPOSURE OF THE GAMMA-7.N NEUTRALIZER, M.M. Gromov Flight Research Institute, dated 30.03.2000",
    path: "effectiveness-doc-32.pdf",
  },
  "effectiveness-doc-33": {
    label: "Conclusion on research into the effect of the Gamma-7.N-IZ device on certain bodily functions of athletes under measured physical exertion, dated 23.03.2000",
    path: "effectiveness-doc-33.pdf",
  },
  "effectiveness-doc-34": {
    label: "RUSSIAN ACADEMY OF MEDICAL-TECHNICAL SCIENCES, Research Institute (BINAR), Medical-Biological Department: conclusion dated 17.09.1999",
    path: "effectiveness-doc-34.pdf",
  },
  "effectiveness-doc-35": {
    label: "Conclusion on additional experimental evaluation of the effect of the Gamma-7.N neutralizer and its modification on the functional state of the human body, dated 02.02.1999",
    path: "effectiveness-doc-35.pdf",
  },
  "effectiveness-doc-36": {
    label: "ALL-RUSSIAN CENTER FOR DISASTER MEDICINE: conclusion on research into the protective properties of the Gamma-7.N product, dated 23.12.1998",
    path: "effectiveness-doc-36.pdf",
  },
  "effectiveness-doc-37": {
    label: "ST. PETERSBURG RESEARCH INSTITUTE OF RADIATION HYGIENE: conclusions dated 27.07.1998",
    path: "effectiveness-doc-37.pdf",
  },
  "effectiveness-doc-38": {
    label: "ALL-RUSSIAN CENTER FOR DISASTER MEDICINE: conclusion dated 08.07.1998",
    path: "effectiveness-doc-38.pdf",
  },
  "effectiveness-doc-39": {
    label: "VTsMK \"Zashchita\" (Disaster Medicine Center \"Protection\"): conclusion dated 08.05.1998",
    path: "effectiveness-doc-39.pdf",
  },
  "effectiveness-doc-40": {
    label: "Central Research Institute of the Ministry of Defence of the Russian Federation, St. Petersburg: preliminary conclusion dated 27.01.1998",
    path: "effectiveness-doc-40.pdf",
  },
  "effectiveness-doc-41": {
    label: "MEDICAL-BIOLOGICAL CENTER conclusion: \"Effect of Gamma-7.N on yeast cells,\" dated 02.06.1997",
    path: "effectiveness-doc-41.pdf",
  },
  "effectiveness-doc-42": {
    label: "CENTER FOR ELECTROMAGNETIC SAFETY: conclusion on the effectiveness of the protective action of the GAMMA-7.N neutralizer, dated 03.06.1996",
    path: "effectiveness-doc-42.pdf",
  },
  "effectiveness-doc-43": {
    label: "Conclusion on the examination and assessment of the physical condition of employees at the KOMPONENT plant, dated 08.04.1996",
    path: "effectiveness-doc-43.pdf",
  },
  "effectiveness-doc-44": {
    label: "Treatment-and-Diagnostic Center of the Russian Ministry of Foreign Economic Relations: conclusion on the evaluation of the protective action of the Gamma-7.N neutralizer, dated 1996",
    path: "effectiveness-doc-44.pdf",
  },
  "effectiveness-doc-45": {
    label: "RUSSIAN ACADEMY OF MEDICAL-TECHNICAL SCIENCES, Research Institute (BINAR), Medical-Biological Department: conclusion (no date given)",
    path: "effectiveness-doc-45.pdf",
  },
};
