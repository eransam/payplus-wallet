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

/** סדר השיעורים = סדר הלמידה (1…N רציף) */
export const learnTopics: LearnTopic[] = [
  // —— יסודות React ——
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
  // —— Hooks ו-State ——
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
  // —— נתונים וטפסים ——
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
    summary: "ניהול נתוני שרת — cache, mutations, invalidation",
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
    summary: "עדכון UI מיד — rollback אם השרת נכשל",
  },
  {
    slug: "redux",
    lesson: 18,
    title: "Redux Toolkit",
    summary: "store גלובלי — slices, dispatch, ליד React Query",
  },
  // —— איכות וביצועים ——
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
    summary: "תפיסת קריסות ב-render — רשת בטיחות ל-UI",
  },
  {
    slug: "code-splitting",
    lesson: 21,
    title: "Code Splitting",
    summary: "lazy + Suspense — טעינת דפים רק כשנכנסים אליהם",
  },
  {
    slug: "performance",
    lesson: 22,
    title: "memo / useMemo / useCallback",
    summary: "מתי לייעל re-renders — עם דמו Console, בלי memo על הכל",
  },
  {
    slug: "memory-leaks",
    lesson: 23,
    title: "זליגת זיכרון (Memory Leaks)",
    summary: "timers, listeners, abort, cleanup ב-useEffect — עם דמו חי",
  },
  {
    slug: "concurrent",
    lesson: 24,
    title: "Concurrent (Transitions)",
    summary: "useTransition, startTransition, useDeferredValue — עם דמו",
  },
  {
    slug: "accessibility",
    lesson: 25,
    title: "Accessibility (a11y)",
    summary: "labels, מקלדת, focus, ARIA בסיסי — לראיון ולמוצר",
  },
  // —— מנוע וסניור ——
  {
    slug: "react-internals",
    lesson: 26,
    title: "מנוע React (סניור)",
    summary: "מנוע React + Concurrent, Context, Portals, Suspense — לראיון",
  },
  {
    slug: "typescript-react",
    lesson: 27,
    title: "TypeScript + React",
    summary: "props, events, children, generics — כמו בפרויקט",
  },
  // —— תשתית ו-DB ——
  {
    slug: "deployment",
    lesson: 28,
    title: "Deployment + AWS",
    summary: "פרונט S3/CloudFront, RDS, EC2, דומיין, Git/CI — סיכום מלא",
  },
  {
    slug: "pgadmin",
    lesson: 29,
    title: "pgAdmin + PostgreSQL",
    summary: "Object Explorer, Constraints, Indexes, ERD, Query Tool — על ה-DB שלנו",
  },
];

/** קיבוץ שיעורים לתפריט צד + מרכז למידה (לפי סדר הלמידה) */
export const learnCategories: LearnCategory[] = [
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
      "performance",
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

export function getTopicBySlug(slug: string): LearnTopic | undefined {
  return learnTopics.find((topic) => topic.slug === slug);
}

export function getTopicsForCategory(category: LearnCategory): LearnTopic[] {
  return category.slugs
    .map((slug) => getTopicBySlug(slug))
    .filter((topic): topic is LearnTopic => topic != null);
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
