# מדריך למידה — שתי גישות לנתוני שרת

**מרכז למידה באפליקציה:** `/learn` — קישורים לכל הנושאים עם הסבר וקבצים רלוונטיים.

הפרויקט מכיל **שתי גישות** לניהול נתונים מהשרת, לצורך למידה.

## 1. React Query (האפליקציה הראשית)

**נתיבים:** `/`, `/merchants`, `/wallets`, `/transactions` וכו'

| קובץ | תפקיד |
|------|--------|
| `src/hooks/useWallets.ts` | `useQuery` + `useMutation` |
| `src/hooks/useMerchants.ts` | אותו דבר |
| `src/hooks/useTransactions.ts` | queries + mutations |
| `src/hooks/queryKeys.ts` | מפתחות cache מרכזיים |
| `src/lib/queryClient.ts` | הגדרות QueryClient |

**מתי משתמשים:** נתוני שרת (wallets, merchants, transactions) — זו הגישה המקצועית הנפוצה.

## 2. Context + useEffect (דף למידה)

**נתיב:** `/learn/context`

| קובץ | תפקיד |
|------|--------|
| `src/hooks/legacy/useWalletsState.ts` | לוגיקה עם useState + useEffect |
| `src/hooks/legacy/useMerchantsState.ts` | אותו דבר |
| `src/contexts/WalletsContext.tsx` | Provider + `useWalletsContext()` |
| `src/contexts/MerchantsContext.tsx` | Provider + `useMerchantsContext()` |
| `src/components/learn/*` | קומפוננטות שמשתמשות ב-Context |

**מתי משתמשים:** להבין Context, state משותף, ולמה React Query מחליף את זה לנתוני שרת.

## למה לא לערבב?

אם שמים `WalletsProvider` על כל האפליקציה **וגם** React Query — שתי מערכות טוענות את אותם נתונים במקביל. לכן Context מבודד לדף `/learn/context` בלבד.

## זרימה להשוואה

```
Context:
  legacy hook → Provider → useWalletsContext() → קומפוננטה

React Query:
  useWallets() → cache גלובלי → קומפוננטה
```
