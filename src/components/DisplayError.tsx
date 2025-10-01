interface DisplayErrorProps {
  error: string | null;
}

export default function DisplayError({ error }: DisplayErrorProps) {
  return (
    error && (
      <div className="flex gap-2 items-start">
        <span>⚠️</span>
        <pre className="inline-block whitespace-pre-wrap text-[0.9rem] text-[color-mix(in_srgb,_red_70%,_black_30%)]">
          {error}
        </pre>
      </div>
    )
  );
}
