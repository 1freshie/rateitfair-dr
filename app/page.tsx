import StarRow from '../components/Star/StarRow';
import Star from '../components/Star/Star';

const HomePage = () => {
  // TODO: add a useEffect or smth else to animate the stars

  return (
    <main className="mt-16 flex w-full flex-1 flex-col md:flex-row items-center justify-between">
      <div className="flex flex-col items-start justify-center w-full md:w-1/2 gap-y-8 text-center md:text-left">
        <h1 className="heading font-bold text-3xl md:text-4xl lg:text-5xl">
          Rate whatever you want. Whenever you want
        </h1>
        <p className="paragraph text-base md:text-lg lg:text-xl">
          We have a large list of your favourite companies' products. Rate the
          ones you used and share your opinion! Be a part of them improving!
        </p>
      </div>
      <div className="mt-9 md:mt-0 flex flex-row items-center justify-evenly w-full md:w-1/2">
        <StarRow starCount={4} width={120} height={120} />
      </div>
    </main>
  );
};

export default HomePage;
