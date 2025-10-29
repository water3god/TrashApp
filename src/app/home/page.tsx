import Image from "next/image";

export default function Home() {
  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold">Welcome to Recycle Expert!</h1>
      <p className="mt-4 pb-4">
        This website provides information on how to properly dispose of various
        types of trash.
      </p>
      <div className="flex">
        <Image
          src={"/Recycle_Xpert_2.jpg"}
          alt="Recycle Expert Logo"
          width={500}
          height={300}
          className="p-5"
        />
        <Image
          src="/home-page-trash.jpg"
          alt="Trash Image"
          width={700}
          height={300}
          className="p-5"
        />
      </div>
    </div>
  );
}
