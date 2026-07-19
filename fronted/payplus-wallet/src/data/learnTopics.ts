export type LearnTopic = {
  slug: string;
  lesson: number;
  title: string;
  summary: string;
};

export type LearnCategory = {
  id: string;
  title: string;
  slugs: string[];
};

/** מסלול לימודים — React / Node.js / MongoDB */
export type LearnTrack = {
  id: "react" | "nodejs" | "mongodb";
  title: string;
  summary: string;
  categories: LearnCategory[];
};

/** —— React —— */
const reactTopics: LearnTopic[] = [
  {
    slug: "basics",
    lesson: 1,
    title: "קומפוננטות, props ו-state",
    summary: "בסיס React — איך בונים UI מחלקים ומנהלים state",
  },
  {
    slug: "api",
    lesson: 2,
    title: "useEffect ו-API",
    summary: "חיבור לשרת עם fetch ו-useEffect",
  },
  {
    slug: "forms",
    lesson: 3,
    title: "טפסים ו-POST",
    summary: "Controlled inputs, שליחת נתונים לשרת",
  },
  {
    slug: "router",
    lesson: 4,
    title: "React Router",
    summary: "ניווט בין דפים עם Routes ו-NavLink",
  },
  {
    slug: "use-params",
    lesson: 5,
    title: "useParams",
    summary: "ראוטים דינמיים — /wallets/:id",
  },
  {
    slug: "dropdown",
    lesson: 6,
    title: "Dropdown (select)",
    summary: "בחירה מרשימה במקום הקלדת ID",
  },
  {
    slug: "custom-hooks",
    lesson: 7,
    title: "Custom Hooks",
    summary: "ארגון לוגיקה ב-hooks לשימוש חוזר",
  },
  {
    slug: "use-ref",
    lesson: 8,
    title: "useRef",
    summary: "DOM, ערכים יציבים, וקשר לזליגת זיכרון — עם דמו חי",
  },
  {
    slug: "use-reducer",
    lesson: 9,
    title: "useReducer",
    summary: "כמו useState בתחביר אחר — action, reducer, dispatch (לא Redux)",
  },
  {
    slug: "use-layout-effect",
    lesson: 10,
    title: "useLayoutEffect",
    summary: "לפני paint — מדידת DOM בלי flicker",
  },
  {
    slug: "forward-ref",
    lesson: 11,
    title: "forwardRef",
    summary: "העברת ref לילד — פוקוס, מודלים, עטיפת input",
  },
  {
    slug: "state-patterns",
    lesson: 12,
    title: "State patterns",
    summary: "immutable, keys, derived state, controlled vs uncontrolled",
  },
  {
    slug: "context",
    lesson: 13,
    title: "Context",
    summary: "שיתוף נתונים בין קומפוננטות — עם דמו חי",
  },
  {
    slug: "validation",
    lesson: 14,
    title: "Validation ו-UX",
    summary: "בדיקות קלט, שגיאות בעברית, AbortController",
  },
  {
    slug: "react-query",
    lesson: 15,
    title: "React Query",
    summary: "במקום useEffect+useState — cache, useQuery, useMutation לנתוני שרת",
  },
  {
    slug: "react-hook-form",
    lesson: 16,
    title: "react-hook-form + zod",
    summary: "טפסים מקצועיים — validation מסודר, פחות boilerplate",
  },
  {
    slug: "optimistic-updates",
    lesson: 17,
    title: "Optimistic Updates",
    summary: "מעדכנים את המסך מיד לפני השרת — ואם נכשל מחזירים אחורה",
  },
  {
    slug: "redux",
    lesson: 18,
    title: "Redux Toolkit",
    summary: "מחסן state לכל האפליקציה — אצלנו pin סיידבר; לא במקום React Query",
  },
  {
    slug: "testing",
    lesson: 19,
    title: "Testing",
    summary: "Vitest + React Testing Library — בדיקות אוטומטיות",
  },
  {
    slug: "error-boundary",
    lesson: 20,
    title: "Error Boundary",
    summary: "רשת בטיחות — באג בציור המסך מציג הודעה במקום מסך לבן",
  },
  {
    slug: "code-splitting",
    lesson: 21,
    title: "Code Splitting",
    summary: "lazy + Suspense — טעינת דפים רק כשנכנסים אליהם",
  },
  {
    slug: "memo",
    lesson: 22,
    title: "React.memo",
    summary: "לדלג על render מיותר של ילד — עם מונה renders חי על המסך",
  },
  {
    slug: "use-memo",
    lesson: 23,
    title: "useMemo",
    summary: "לזכור תוצאה של חישוב כבד במקום לחשב שוב בכל render — עם דמו חי",
  },
  {
    slug: "use-callback",
    lesson: 24,
    title: "useCallback",
    summary: "פונקציה יציבה בין renders — החבר הכי טוב של memo, עם דמו חי",
  },
  {
    slug: "memory-leaks",
    lesson: 25,
    title: "זליגת זיכרון (Memory Leaks)",
    summary: "timers, listeners, abort, cleanup ב-useEffect — עם דמו חי",
  },
  {
    slug: "concurrent",
    lesson: 26,
    title: "Concurrent (Transitions)",
    summary: "useTransition, startTransition, useDeferredValue — עם דמו",
  },
  {
    slug: "accessibility",
    lesson: 27,
    title: "Accessibility (a11y)",
    summary: "labels, מקלדת, focus, ARIA בסיסי — לראיון ולמוצר",
  },
  {
    slug: "react-internals",
    lesson: 28,
    title: "מנוע React (סניור)",
    summary: "מנוע React + Concurrent, Context, Portals, Suspense — לראיון",
  },
  {
    slug: "typescript-react",
    lesson: 29,
    title: "TypeScript + React",
    summary: "props, events, children, generics — כמו בפרויקט",
  },
  {
    slug: "deployment",
    lesson: 30,
    title: "Deployment + AWS",
    summary: "פרונט S3/CloudFront, RDS, EC2, דומיין, Git/CI — סיכום מלא",
  },
  {
    slug: "pgadmin",
    lesson: 31,
    title: "pgAdmin + PostgreSQL",
    summary: "Object Explorer, Constraints, Indexes, ERD, Query Tool — על ה-DB שלנו",
  },
];

const reactCategories: LearnCategory[] = [
  {
    id: "foundations",
    title: "יסודות React",
    slugs: ["basics", "api", "forms", "router", "use-params", "dropdown"],
  },
  {
    id: "hooks-state",
    title: "Hooks ו-State",
    slugs: [
      "custom-hooks",
      "use-ref",
      "use-reducer",
      "use-layout-effect",
      "forward-ref",
      "state-patterns",
    ],
  },
  {
    id: "data-forms",
    title: "נתונים וטפסים",
    slugs: [
      "context",
      "validation",
      "react-query",
      "react-hook-form",
      "optimistic-updates",
      "redux",
    ],
  },
  {
    id: "quality",
    title: "איכות וביצועים",
    slugs: [
      "testing",
      "error-boundary",
      "code-splitting",
      "memo",
      "use-memo",
      "use-callback",
      "memory-leaks",
      "concurrent",
      "accessibility",
    ],
  },
  {
    id: "senior",
    title: "מנוע וסניור",
    slugs: ["react-internals", "typescript-react"],
  },
  {
    id: "infra",
    title: "תשתית ו-DB",
    slugs: ["deployment", "pgadmin"],
  },
];

/** —— Node.js —— (מספור שיעורים נפרד מ-React) */
const nodeTopics: LearnTopic[] = [
  {
    slug: "node-what-is",
    lesson: 1,
    title: "מה זה Node.js",
    summary: "מאפס — runtime ל-JS בשרת, למה נוצר, ומה אפשר לבנות איתו",
  },
  {
    slug: "node-event-loop",
    lesson: 2,
    title: "Event Loop",
    summary: "למה Node לא חוסם, call stack, queues, ומה זה באמת single-threaded",
  },
  {
    slug: "node-modules",
    lesson: 3,
    title: "Modules (CJS / ESM)",
    summary: "require מול import, package.json type, וייצוא/ייבוא בין קבצים",
  },
  {
    slug: "node-async",
    lesson: 4,
    title: "Async: Promises ו-async/await",
    summary: "מ-callback hell עד async/await — ואיך לא לבלוע שגיאות",
  },
  {
    slug: "node-http",
    lesson: 5,
    title: "HTTP מאפס",
    summary: "בקשה, תשובה, status codes, headers, body — השפה של כל API",
  },
  {
    slug: "node-express",
    lesson: 6,
    title: "Express",
    summary: "בניית שרת Express — listen, routes, json parser, routers",
  },
  {
    slug: "node-middleware",
    lesson: 7,
    title: "Middleware",
    summary: "שרשרת next() — cors, helmet, auth, וסדר ההרצה",
  },
  {
    slug: "node-architecture",
    lesson: 8,
    title: "ארכיטקטורת שכבות",
    summary: "controllers → services → data — הפרדת אחריות ולמה זה סניור",
  },
  {
    slug: "node-errors",
    lesson: 9,
    title: "Error Handling",
    summary: "מחלקת שגיאה מותאמת, error middleware עם 4 ארגומנטים, לא לקרוס",
  },
  {
    slug: "node-env",
    lesson: 10,
    title: "Env ו-Config",
    summary: "dotenv, NODE_ENV, סודות שלא נכנסים ל-git — ניהול config נכון",
  },
  {
    slug: "node-postgres",
    lesson: 11,
    title: "PostgreSQL + Pool",
    summary: "pg Pool, connect, queries — עבודה עם מסד נתונים ב-Node",
  },
  {
    slug: "node-transactions",
    lesson: 12,
    title: "טרנזקציות DB",
    summary: "BEGIN/COMMIT/ROLLBACK — למה פעולות כספיות חייבות atomicity",
  },
  {
    slug: "node-redis",
    lesson: 13,
    title: "Redis",
    summary: "cache מהיר בזיכרון — מתי ולמה משתמשים בו ליד מסד נתונים",
  },
  {
    slug: "node-idempotency",
    lesson: 14,
    title: "Idempotency",
    summary: "אותה בקשה פעמיים לא מבצעת פעמיים — דפוס סניור לתשלומים",
  },
  {
    slug: "node-auth",
    lesson: 15,
    title: "JWT ו-Auth",
    summary: "login, token, middleware להגנת routes — flow אימות מלא",
  },
  {
    slug: "node-security",
    lesson: 16,
    title: "אבטחת API",
    summary: "helmet, cors, bcrypt, לא לחשוף stack ב-production",
  },
  {
    slug: "node-logging",
    lesson: 17,
    title: "Logging",
    summary: "לוגים מסודרים (Winston), levels — לראות מה קרה בפרודקשן",
  },
  {
    slug: "node-process",
    lesson: 18,
    title: "Process ו-Graceful Shutdown",
    summary: "signals, לסגור חיבורים נקי, לא לאבד בקשות באמצע",
  },
  {
    slug: "node-streams",
    lesson: 19,
    title: "Streams",
    summary: "לקרוא/לכתוב בחלקים — קבצים גדולים בלי לפוצץ זיכרון",
  },
  {
    slug: "node-typescript",
    lesson: 20,
    title: "TypeScript ב-Node",
    summary: "ts-node, types ל-Express, טיפוסים למודלים ולבקשות",
  },
  {
    slug: "node-testing",
    lesson: 21,
    title: "Testing בשרת",
    summary: "unit מול integration, Jest/Vitest, supertest, mocking ל-DB",
  },
  {
    slug: "node-validation",
    lesson: 22,
    title: "Validation בצד שרת",
    summary: "Zod/Joi — לעולם לא לסמוך על הלקוח, 400 עם הודעה ברורה",
  },
  {
    slug: "node-docker",
    lesson: 23,
    title: "Docker ל-Node",
    summary: "Dockerfile, image, container, docker-compose עם DB ו-Redis",
  },
  {
    slug: "node-scaling",
    lesson: 24,
    title: "Scaling ו-Performance",
    summary: "cluster, worker_threads, load balancer, stateless — מתי ואיך לגדול",
  },
  {
    slug: "node-interview-qa",
    lesson: 25,
    title: "שאלות ותשובות לראיון",
    summary: "שאלות ראיון נפוצות על Node.js עם תשובות ברמת סניור — לחזרה מהירה",
  },
];

const nodeCategories: LearnCategory[] = [
  {
    id: "node-foundations",
    title: "יסודות Node.js",
    slugs: ["node-what-is", "node-event-loop", "node-modules", "node-async"],
  },
  {
    id: "node-http-express",
    title: "HTTP ו-Express",
    slugs: ["node-http", "node-express", "node-middleware", "node-architecture"],
  },
  {
    id: "node-data",
    title: "נתונים ואמינות",
    slugs: [
      "node-errors",
      "node-env",
      "node-postgres",
      "node-transactions",
      "node-redis",
      "node-idempotency",
    ],
  },
  {
    id: "node-senior",
    title: "אבטחה וסניור",
    slugs: [
      "node-auth",
      "node-security",
      "node-logging",
      "node-process",
      "node-streams",
      "node-typescript",
    ],
  },
  {
    id: "node-advanced",
    title: "סניור מתקדם",
    slugs: [
      "node-testing",
      "node-validation",
      "node-docker",
      "node-scaling",
      "node-interview-qa",
    ],
  },
];

/** —— MongoDB —— (מספור שיעורים נפרד) */
const mongoTopics: LearnTopic[] = [
  {
    slug: "mongo-what-is",
    lesson: 1,
    title: "מה זה MongoDB",
    summary: "מאפס — מסד מסמכים (NoSQL), במה שונה מ-Postgres, ומתי בוחרים בו",
  },
  {
    slug: "mongo-install",
    lesson: 2,
    title: "התקנה + Compass (GUI)",
    summary: "הרצה עם Docker, התקנת MongoDB Compass, mongosh — סביבת עבודה מלאה",
  },
  {
    slug: "mongo-crud",
    lesson: 3,
    title: "CRUD — הפעולות הבסיסיות",
    summary: "insertOne, find, updateOne, deleteOne — עם דוגמאות על ארנקים",
  },
  {
    slug: "mongo-queries",
    lesson: 4,
    title: "שאילתות ואופרטורים",
    summary: "$gt, $in, $or, sort, limit, projection — לשלוף בדיוק מה שצריך",
  },
  {
    slug: "mongo-node",
    lesson: 5,
    title: "MongoDB עם Node.js",
    summary: "החיבור מהקוד — driver רשמי מול Mongoose, סכמות ומודלים",
  },
  {
    slug: "mongo-schema-design",
    lesson: 6,
    title: "עיצוב סכמה: Embed מול Reference",
    summary: "ההחלטה החשובה ביותר במונגו — מתי מטמיעים מסמך ומתי מפנים",
  },
  {
    slug: "mongo-indexes-aggregation",
    lesson: 7,
    title: "אינדקסים ו-Aggregation",
    summary: "ביצועים עם אינדקסים, ו-pipeline לסיכומים — כמו GROUP BY ב-SQL",
  },
];

const mongoCategories: LearnCategory[] = [
  {
    id: "mongo-foundations",
    title: "יסודות MongoDB",
    slugs: ["mongo-what-is", "mongo-install", "mongo-crud", "mongo-queries"],
  },
  {
    id: "mongo-advanced",
    title: "עבודה אמיתית",
    slugs: ["mongo-node", "mongo-schema-design", "mongo-indexes-aggregation"],
  },
];

export const learnTracks: LearnTrack[] = [
  {
    id: "react",
    title: "React",
    summary: "קורס React מלא — מקומפוננטות ועד מנוע וסניור, על בסיס PayPlus Wallet",
    categories: reactCategories,
  },
  {
    id: "nodejs",
    title: "Node.js",
    summary:
      "קורס Node.js / Express כללי ברמת סניור — Event Loop, שכבות, Postgres, Redis, JWT",
    categories: nodeCategories,
  },
  {
    id: "mongodb",
    title: "MongoDB",
    summary:
      "קורס MongoDB מאפס — מסמכים, התקנה + Compass, CRUD, שאילתות, Mongoose, עיצוב סכמה",
    categories: mongoCategories,
  },
];

/** כל השיעורים (כל המסלולים) */
export const learnTopics: LearnTopic[] = [
  ...reactTopics,
  ...nodeTopics,
  ...mongoTopics,
];

/** תאימות לאחור — קטגוריות React בלבד */
export const learnCategories: LearnCategory[] = reactCategories;

export function getTopicBySlug(slug: string): LearnTopic | undefined {
  return learnTopics.find((topic) => topic.slug === slug);
}

export function getTrackById(id: LearnTrack["id"]): LearnTrack | undefined {
  return learnTracks.find((track) => track.id === id);
}

export function getTrackForSlug(slug: string): LearnTrack | undefined {
  return learnTracks.find((track) =>
    track.categories.some((cat) => cat.slugs.includes(slug)),
  );
}

export function getTopicsForCategory(category: LearnCategory): LearnTopic[] {
  return category.slugs
    .map((slug) => getTopicBySlug(slug))
    .filter((topic): topic is LearnTopic => topic != null);
}

/** סדר השיעורים בתוך מסלול אחד (React או Node) */
export function getTopicsInTrackOrder(track: LearnTrack): LearnTopic[] {
  return track.categories.flatMap((category) => getTopicsForCategory(category));
}

export function getAdjacentTopics(slug: string): {
  prev?: LearnTopic;
  next?: LearnTopic;
} {
  const track = getTrackForSlug(slug);
  if (!track) {
    return {};
  }
  const ordered = getTopicsInTrackOrder(track);
  const index = ordered.findIndex((topic) => topic.slug === slug);
  if (index < 0) {
    return {};
  }
  return {
    prev: index > 0 ? ordered[index - 1] : undefined,
    next: index < ordered.length - 1 ? ordered[index + 1] : undefined,
  };
}
