import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <>
      <section className="container flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-black text-center text-[2rem] md:text-[2.5rem] font-semibold md:px-[10%]">
          Stay on <span className="text-ruby">Trak</span>, Stay Healthy
        </h1>
        <div className=" img__wrapper img-sm md:img-md">
          <img
            src="/images/pills-in-hand.webp"
            alt=""
            className="rounded-full shadow-xl"
          />
        </div>
        <Button asChild size={'lg'} className="text-[1.5rem] shadow-sm">
          <Link to="/add-medications">Start Tracking now</Link>
        </Button>
      </section>
    </>
  );
}
