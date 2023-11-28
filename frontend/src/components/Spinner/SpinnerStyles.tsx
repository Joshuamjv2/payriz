export const SpinnerStyles = () => (
  <style>
    {`
     @keyframes spinner {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      .loading-spinner {
        width: 50px;
        height: 50px;
        border: 10px solid #f3f3f3;
        border-top: 10px solid #0075FF;
        border-radius: 50%;
        animation: spinner 1.5s linear infinite;
      }
        `}
  </style>
);
