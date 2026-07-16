export type LearnTopic = {
  slug: string;
  lesson: number;
  title: string;
  summary: string;
};

export const learnTopics: LearnTopic[] = [
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
    lesson: 5,
    title: "React Router",
    summary: "ניווט בין דפים עם Routes ו-NavLink",
  },
  {
    slug: "use-params",
    lesson: 8,
    title: "useParams",
    summary: "ראוטים דינמיים — /wallets/:id",
  },
  {
    slug: "dropdown",
    lesson: 9,
    title: "Dropdown (select)",
    summary: "בחירה מרשימה במקום הקלדת ID",
  },
  {
    slug: "custom-hooks",
    lesson: 10,
    title: "Custom Hooks",
    summary: "ארגון לוגיקה ב-hooks לשימוש חוזר",
  },
  {
    slug: "context",
    lesson: 11,
    title: "Context",
    summary: "שיתוף נתונים בין קומפוננטות — עם דמו חי",
  },
  {
    slug: "validation",
    lesson: 12,
    title: "Validation ו-UX",
    summary: "בדיקות קלט, שגיאות בעברית, AbortController",
  },
  {
    slug: "react-query",
    lesson: 13,
    title: "React Query",
    summary: "ניהול נתוני שרת — cache, mutations, invalidation",
  },
  {
    slug: "testing",
    lesson: 14,
    title: "Testing",
    summary: "Vitest + React Testing Library — בדיקות אוטומטיות",
  },
  {
    slug: "react-hook-form",
    lesson: 15,
    title: "react-hook-form + zod",
    summary: "טפסים מקצועיים — validation מסודר, פחות boilerplate",
  },
  {
    slug: "error-boundary",
    lesson: 17,
    title: "Error Boundary",
    summary: "תפיסת קריסות ב-render — רשת בטיחות ל-UI",
  },
  {
    slug: "code-splitting",
    lesson: 19,
    title: "Code Splitting",
    summary: "lazy + Suspense — טעינת דפים רק כשנכנסים אליהם",
  },
  {
    slug: "use-ref",
    lesson: 20,
    title: "useRef",
    summary: "DOM, ערכים יציבים, וקשר לזליגת זיכרון — עם דמו חי",
  },
  {
    slug: "redux",
    lesson: 21,
    title: "Redux Toolkit",
    summary: "store גלובלי — slices, dispatch, ליד React Query",
  },
  {
    slug: "optimistic-updates",
    lesson: 22,
    title: "Optimistic Updates",
    summary: "עדכון UI מיד — rollback אם השרת נכשל",
  },
  {
    slug: "deployment",
    lesson: 23,
    title: "Deployment + AWS",
    summary: "פרונט S3/CloudFront, RDS, EC2, דומיין, Git/CI — סיכום מלא",
  },

];

export function getTopicBySlug(slug: string): LearnTopic | undefined {
  return learnTopics.find((topic) => topic.slug === slug);
}

export function getAdjacentTopics(slug: string): {
  prev?: LearnTopic;
  next?: LearnTopic;
} {
  const index = learnTopics.findIndex((topic) => topic.slug === slug);
  if (index < 0) {
    return {};
  }
  return {
    prev: index > 0 ? learnTopics[index - 1] : undefined,
    next: index < learnTopics.length - 1 ? learnTopics[index + 1] : undefined,
  };
}
