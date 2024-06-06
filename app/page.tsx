import Image from "next/image";
import CategoriesPage from "./categories/CategoriesPage";
import Downlaod from "./pages/hompage/download";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto text-center items-center my-auto bottom-0 top-0 h-full ">
      <div className="md:mt-20 mt-10 my-auto h-full">
        <Image
          src="/images/logo-s.png"
          className="mx-auto  h-[30px] w-[120px]  lg:h-[42px] lg:w-[160px]"
          height={42}
          width={160}
          alt="logo"
        />
        <h1 className=" text-3xl md:text-6xl mt-36 font-semibold md:leading-normal">
          get ready to connect & <br /> elevate!
        </h1>
        <p className="text-xl mt-4">stay tuned...</p>
      </div>
    </div>
  );
}
// {
//   /* <div className="max-w-7xl mx-auto text-center items-center my-auto bottom-0 top-0 h-full ">

// <div className="md:mt-20 mt-10 my-auto h-full">
//   <Image
//     src="/images/logo-s.png"
//     className="mx-auto  h-[30px] w-[120px]  lg:h-[42px] lg:w-[160px]"
//     height={42}
//     width={160}
//     alt="logo"
//   />
//   <h1 className=" text-3xl md:text-6xl mt-36 font-semibold md:leading-normal">
//     get ready to connect & <br /> elevate!
//   </h1>
//   <p className="text-xl mt-4">stay tuned...</p>
// </div>
// </div> */
// }
// <div className="max-w-7xl mx-auto">
// {/* <Downlaod /> */}
// <CategoriesPage />
// </div>
