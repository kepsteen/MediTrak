import { PillBottle } from 'lucide-react';

export function NotFound() {
  return (
    <>
      <section className="container flex items-center justify-center h-screen">
        <div className="relative">
          <p className="absolute left-[-100px] top-[100px] sm:left-[-140px] md:left-[-180px] animate-pill-404 text-4xl">
            404 page not found.
          </p>
          <PillBottle size={100} className="text-ruby animate-pill-bottle" />
        </div>
      </section>
    </>
  );
}
