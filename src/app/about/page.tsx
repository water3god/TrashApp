import Image from "next/image";

export default function Home() {
  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold">Welcome to Recycle Expert!</h1>
      <p className="mt-4 pb-4">
        This app was built to help easily identify the recycle method for
        various types of trash. Built By: Roger Shi and Jason Shi
      </p>
      <Image
        src="/creator.png"
        alt="Roger Shi Image"
        width={300}
        height={200}
        className="pb-2"
      />
      <Image src="/Jason.jpg" alt="Jason Shi Image" width={300} height={200} />
    </div>
  );
}
