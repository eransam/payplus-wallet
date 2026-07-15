type LearnCodeProps = {
  code: string;
  label?: string;
};

function LearnCode({ code, label }: LearnCodeProps) {
  return (
    <div className="learn-code">
      {label ? <p className="learn-code__label">{label}</p> : null}
      <pre>
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}

export default LearnCode;
