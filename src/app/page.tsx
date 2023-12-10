import Image from "next/image";
import { GiChessRook } from "react-icons/gi";

export default function Home() {
  return (
    <section>
      <div className="flex items-center gap-4">
        <GiChessRook size={50} />
        <h1 className="text-5xl font-bold text-stone-800">Welcome to Magic Fortress!</h1>
        <GiChessRook size={50} />
      </div>
    </section>
  );
}
