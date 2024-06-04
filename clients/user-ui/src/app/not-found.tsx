import Link from "next/link";
import Image from "next/image";
import notfoundsvg from "@/public/undraw_page_not_found_re_e9o6.svg";
const Custom404 = () => {
  return (
    <div
      className="mt-10 flex flex-col text-center justify-center items-center gap-8"
      style={{ textAlign: "center", padding: "50px" }}
    >
      <Image src={notfoundsvg} alt="not found" width={500} height={500} />
      <p className="text-2xl">
        Oops! The page you are looking for does not exist.
      </p>
      <Link href="/" className="border-l border-l-white-400 p-4 hover:border-r">
        Go back to Home
      </Link>
    </div>
  );
};

export default Custom404;
