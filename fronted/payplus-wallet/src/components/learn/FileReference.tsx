type FileReferenceProps = {
  path: string;
  description?: string;
};

function FileReference({ path, description }: FileReferenceProps) {
  return (
    <li className="mb-2">
      <code>{path}</code>
      {description ? ` — ${description}` : ""}
    </li>
  );
}

export default FileReference;
