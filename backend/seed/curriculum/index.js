import { CURRICULUM_SUBJECTS } from "./subjects.js";
import { DSA_UNITS, DSA_CHAPTERS, DSA_TOPICS } from "./dsa.js";
import { DBMS_UNITS, DBMS_CHAPTERS, DBMS_TOPICS } from "./dbms.js";
import { OS_UNITS, OS_CHAPTERS, OS_TOPICS } from "./os.js";
import { CN_UNITS, CN_CHAPTERS, CN_TOPICS } from "./cn.js";
import { OOPS_UNITS, OOPS_CHAPTERS, OOPS_TOPICS } from "./oops.js";
import { SYSTEM_DESIGN_UNITS, SYSTEM_DESIGN_CHAPTERS, SYSTEM_DESIGN_TOPICS } from "./systemDesign.js";
import { APTITUDE_UNITS, APTITUDE_CHAPTERS, APTITUDE_TOPICS } from "./aptitude.js";
import { WEB_DEV_UNITS, WEB_DEV_CHAPTERS, WEB_DEV_TOPICS } from "./webDev.js";
import { ML_AI_UNITS, ML_AI_CHAPTERS, ML_AI_TOPICS } from "./mlAi.js";
import { EXTENDED_SUBJECTS_DEFINITIONS, generateSubjectCurriculum } from "./extendedSubjects.js";

// Generate curriculum trees for all extended CSE subjects
const extendedGenerated = EXTENDED_SUBJECTS_DEFINITIONS.map(generateSubjectCurriculum);
const EXTENDED_UNITS = extendedGenerated.flatMap((g) => g.units);
const EXTENDED_CHAPTERS = extendedGenerated.flatMap((g) => g.chapters);
const EXTENDED_TOPICS = extendedGenerated.flatMap((g) => g.topics);

export { CURRICULUM_SUBJECTS };

export const CURRICULUM_UNITS = [
  ...DSA_UNITS,
  ...DBMS_UNITS,
  ...OS_UNITS,
  ...CN_UNITS,
  ...OOPS_UNITS,
  ...SYSTEM_DESIGN_UNITS,
  ...APTITUDE_UNITS,
  ...WEB_DEV_UNITS,
  ...ML_AI_UNITS,
  ...EXTENDED_UNITS,
];

export const CURRICULUM_CHAPTERS = [
  ...DSA_CHAPTERS,
  ...DBMS_CHAPTERS,
  ...OS_CHAPTERS,
  ...CN_CHAPTERS,
  ...OOPS_CHAPTERS,
  ...SYSTEM_DESIGN_CHAPTERS,
  ...APTITUDE_CHAPTERS,
  ...WEB_DEV_CHAPTERS,
  ...ML_AI_CHAPTERS,
  ...EXTENDED_CHAPTERS,
];

export const CURRICULUM_TOPICS = [
  ...DSA_TOPICS,
  ...DBMS_TOPICS,
  ...OS_TOPICS,
  ...CN_TOPICS,
  ...OOPS_TOPICS,
  ...SYSTEM_DESIGN_TOPICS,
  ...APTITUDE_TOPICS,
  ...WEB_DEV_TOPICS,
  ...ML_AI_TOPICS,
  ...EXTENDED_TOPICS,
];
