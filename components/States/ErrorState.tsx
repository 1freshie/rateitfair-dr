interface ErrorProps {
  error: string;
}

export default function ErrorState({ error }: ErrorProps) {
  return (
    <div className="self-center justify-self-center flex flex-col flex-1 justify-center items-center text-center">
      <h1 className="heading text-error--red">Error</h1>
      <p className="paragraph text-error--red">{error}</p>
    </div>
  );
}
