import { SpinnerStyles } from './SpinnerStyles';

export default function LoadingSpinner() {
  return (
    <>
      <SpinnerStyles />
      <div className="spinner-container flex justify-center">
        <div className="loading-spinner"></div>
      </div>
    </>
  );
}
