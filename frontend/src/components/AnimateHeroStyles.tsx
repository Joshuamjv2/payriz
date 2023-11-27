export const AnimateHeroStyles = () => (
  <style>
    {`
    @-webkit-keyframes blackWhite {  
        0% { color: #0075FF; }
        50% { color: #0075FF; }
        51% { color: #1A7A30; }
        100% { color: #1A7A30; }
      }
      
      #animate-hero-payriz {
          height: 100px;
          color: black;
          -webkit-animation-name: blackWhite;  
          -webkit-animation-iteration-count: infinite;  
          -webkit-animation-duration: 2s; 
      }
      `}
  </style>
);
