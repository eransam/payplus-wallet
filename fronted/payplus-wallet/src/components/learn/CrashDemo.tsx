import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

type CrashDemoProps = {
  shouldCrash: boolean;
};

/** קורס ב-render — לדמו של Error Boundary בלבד */
function CrashDemoContent({ shouldCrash }: CrashDemoProps) {
  if (shouldCrash) {
    throw new Error("דמו קריסה ב-render");
  }

  return (
    <Alert variant="success" className="mb-0">
      הקומפוננטה עובדת כרגיל.
    </Alert>
  );
}

function CrashDemo() {
  const [shouldCrash, setShouldCrash] = useState(false);

  return (
    <div>
      <p className="text-muted mb-3">
        לחץ על הכפתור — הקומפוננטה תקרוס ב-render ו-Error Boundary יתפוס.
      </p>
      <Button
        variant="warning"
        className="mb-3"
        onClick={() => setShouldCrash(true)}
        disabled={shouldCrash}
      >
        גרום לקריסה
      </Button>
      <CrashDemoContent shouldCrash={shouldCrash} />
    </div>
  );
}

export default CrashDemo;
