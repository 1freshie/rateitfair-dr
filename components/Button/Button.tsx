'use client';

type ButtonProps = {
  text: string;
  textSize: string;
  color: string;
};

const Button: React.FC<ButtonProps> = ({ text, textSize, color }) => {
  let bgColor = '';
  let hoverColor = '';

  if (color === 'orange') {
    bgColor = 'bg-primary--orange';
    hoverColor = 'hover:bg-secondary--orange';
  } else if (color === 'blue') {
    bgColor = 'bg-primary--blue';
    hoverColor = 'hover:bg-secondary--gray';
  } else {
    throw new Error('Invalid color');
  }

  if (
    textSize.includes('xs') &&
    textSize.includes('sm') &&
    textSize.includes('base') &&
    textSize.includes('md') &&
    textSize.includes('lg') &&
    textSize.includes('xl') &&
    textSize.includes('2xl') &&
    textSize.includes('3xl') &&
    textSize.includes('4xl') &&
    textSize.includes('5xl') &&
    textSize.includes('6xl')
  ) {
    throw new Error('Invalid text size');
  }

  return (
    <button className={`button ${textSize} ${bgColor} ${hoverColor}`}>
      <p>{text}</p>
    </button>
  );
};

export default Button;
