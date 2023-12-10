import Image from "next/image";
import { GiChessRook } from "react-icons/gi";

export default function Home() {
  return (
    <section>
      <div className="flex flex-col md:flex-row text-center items-center lg:gap-4">
        <GiChessRook size={50} />
        <h1 className="text-5xl font-bold text-stone-800  md:w-[25rem]">Welcome to Magic Fortress!</h1>
        <GiChessRook size={50} />
      </div>
    </section>
  );
}
