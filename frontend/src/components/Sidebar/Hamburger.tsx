import React from 'react';

type Props = {
  openDrawer: boolean;
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
};

const Hamburger = ({ openDrawer, setOpenDrawer }: Props) => {
  const styles = {
    container: {
      height: '32px',
      width: '32px',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      padding: '4px',
      marginLeft: '4px',
    },
    line: {
      height: '2px',
      width: '20px',
      background: '#05060F',
      transition: 'all 0.2s ease',
    },
    lineTop: {
      transform: openDrawer ? 'rotate(45deg)' : 'none',
      transformOrigin: 'top left',
      marginBottom: '5px',
    },
    lineMiddle: {
      opacity: openDrawer ? 0 : 1,
      transform: openDrawer ? 'translateX(-16px)' : 'none',
    },
    lineBottom: {
      transform: openDrawer ? 'translateX(-1px) rotate(-45deg)' : 'none',
      transformOrigin: 'top left',
      marginTop: '5px',
    },
  };
  return (
    <div style={styles.container} onClick={() => setOpenDrawer(!openDrawer)}>
      <div style={{ ...styles.line, ...styles.lineTop }} />
      <div style={{ ...styles.line, ...styles.lineMiddle }} />
      <div style={{ ...styles.line, ...styles.lineBottom }} />
    </div>
  );
};

export default Hamburger;
