import { useState, type FormEvent } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  decrementLearnCounter,
  incrementLearnCounter,
  resetLearnCounter,
  setLearnMessage,
  toggleSidebarPinned,
} from "../../store/slices/uiSlice";

function ReduxDemo() {
  const dispatch = useAppDispatch();
  const learnCounter = useAppSelector((state) => state.ui.learnCounter);
  const learnMessage = useAppSelector((state) => state.ui.learnMessage);
  const sidebarPinned = useAppSelector((state) => state.ui.sidebarPinned);
  const [draft, setDraft] = useState(learnMessage);

  function handleMessageSubmit(event: FormEvent) {
    event.preventDefault();
    dispatch(setLearnMessage(draft.trim() || "שלום מ-Redux"));
  }

  return (
    <Stack gap={3}>
      <Alert variant="secondary" className="mb-0">
        <div>
          <strong>learnCounter:</strong> {learnCounter}
        </div>
        <div>
          <strong>learnMessage:</strong> {learnMessage}
        </div>
        <div>
          <strong>sidebarPinned:</strong> {sidebarPinned ? "כן" : "לא"}
        </div>
      </Alert>

      <Stack direction="horizontal" gap={2} className="flex-wrap">
        <Button type="button" onClick={() => dispatch(incrementLearnCounter())}>
          +1
        </Button>
        <Button
          type="button"
          variant="outline-primary"
          onClick={() => dispatch(decrementLearnCounter())}
        >
          -1
        </Button>
        <Button
          type="button"
          variant="outline-secondary"
          onClick={() => dispatch(resetLearnCounter())}
        >
          איפוס מונה
        </Button>
        <Button
          type="button"
          variant="outline-dark"
          onClick={() => dispatch(toggleSidebarPinned())}
        >
          Toggle pin סיידבר
        </Button>
      </Stack>

      <Form onSubmit={handleMessageSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>הודעה גלובלית (Redux)</Form.Label>
          <Form.Control
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="כתוב הודעה..."
          />
        </Form.Group>
        <Button type="submit" size="sm">
          שמור להודעה ב-store
        </Button>
      </Form>

      <p className="text-muted small mb-0">
        שנה כאן → עבור לדף אחר וחזור: המונה וההודעה נשארים (כל עוד לא רעננת את
        הדפדפן). ה-pin נשמר גם ב-<code>localStorage</code>.
      </p>
    </Stack>
  );
}

export default ReduxDemo;
