"use client";

import { useMemo } from "react";
import Trash from "../../../../public/trash.json";
import Image from "next/image";
import { notFound } from "next/navigation";

interface ItemData {
  name: string;
  description: string;
  id: number;
  disposeMethod: string;
  image?: string;
  wikiLink?: string;
}

export default function ItemPage({ params }: { params: { id: string } }) {
  const ItemData: ItemData | undefined = useMemo(() => {
    return Trash.trashItems.find((item) => item.id === parseInt(params.id));
  }, [params.id]);

  if (!ItemData) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold p-5">{ItemData?.name}</h1>
      <p className="text-lg p-5">{ItemData?.description}</p>
      <p className="text-md p-5">
        Disposal Method:{" "}
        <span className="font-bold">
          {ItemData?.disposeMethod || "Not specified"}
        </span>
      </p>
      {ItemData?.image && (
        <Image
          src={ItemData.image}
          alt={ItemData.name}
          width={300}
          height={300}
          className="p-5"
        />
      )}
      {ItemData?.wikiLink && (
        <p className="text-md p-5">
          More Info:{" "}
          <a
            href={ItemData.wikiLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Wikipedia
          </a>
        </p>
      )}
    </div>
  );
}
