'use client';

type ButtonProps = {
  text: string;
  color: string;
};

const Button: React.FC<ButtonProps> = ({ text, color }) => {
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

  return (
    <button
      className={`p-3 rounded-3xl ${bgColor} ${hoverColor} text-background--white text-center text-2xl font-semibold tracking-wide`}
    >
      <p>{text}</p>
    </button>
  );
};

export default Button;
