import LoadingSpinner from "./LoadingSpinner";

export default function LoadingState() {
  return (
    <div className="self-center flex h-96 flex-1 justify-center items-center">
      <LoadingSpinner />
    </div>
  );
}
