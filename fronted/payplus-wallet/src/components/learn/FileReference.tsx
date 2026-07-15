type FileReferenceProps = {
  path: string;
  description?: string;
};

function FileReference({ path, description }: FileReferenceProps) {
  return (
    <li>
      <code>{path}</code>
      {description ? <span>{description}</span> : null}
    </li>
  );
}

export default FileReference;
