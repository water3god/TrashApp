import Image from "next/image";
import Trash from "../../../public/trash.json";
import { JSX, useMemo } from "react";
import Link from "next/link";

export default function Catalog() {
  const Column = useMemo(() => {
    const rows: JSX.Element[] = [];

    const rowNum = Math.floor(Trash.trashItems.length / 10);

    for (let i = 0; i < rowNum; i++) {
      const columns: JSX.Element[] = [];
      const columnNum = Math.max(rowNum - i * 10, 10);

      for (let j = 0; j < columnNum; j++) {
        const item = Trash.trashItems[i * 10 + j];

        columns.push(
          <td
            key={item.id}
            className="w-24 h-24 align-middle text-center outline relative"
            style={{ width: "6rem", height: "6rem" }}
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              style={{ objectFit: "contain" }}
              className="absolute inset-0"
            />
            <Link
              href={`/item/${item.id}`}
              className="flex items-center justify-center mx-auto hover:underline w-fit h-fit relative z-10 bg-black"
            >
              {item.name}
            </Link>
          </td>
        );
      }

      rows.push(<tr key={i}>{columns}</tr>);
    }

    return <tbody>{rows}</tbody>;
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold">Catalog</h1>
      <p className="mt-4 pb-4">
        This website provides information on how to properly dispose of various
        types of trash.
      </p>

      <table>{Column}</table>
    </div>
  );
}
