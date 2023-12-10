import { AiOutlineLoading3Quarters } from "react-icons/ai";

const loading = () => {
  return (
    <section className="flex justify-center items-center">
      <AiOutlineLoading3Quarters className="text-rose-500 animate-spin" size={60} />
    </section>
  );
};

export default loading;
