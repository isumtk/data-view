import "./App.css";
import add from "./assets/add.svg";
import uuid4 from "uuid4";
import useEntity from "./hooks/useEntity";
import initialData from "./assets/dummy__data.json";
import DataViewComponent from "./component/data-view";
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(initialData);
  const { addEntity, deleteEntity, updateEntity } = useEntity(setData);

  useEffect(() => {
    console.log("Entites changed", { data });
  }, [data]);

  return (
    <div className="container mx-auto h-full flex flex-col">
      <div className="w-full h-12 bg-neutral-300 mb-5 rounded flex items-center justify-between px-4">
        <button
          className="px-5 py-1 rounded bg-slate-100"
          onClick={() => console.log({ data })}
        >
          Save
        </button>
        <a target={"_blank"} href="https://www.linkedin.com/in/isumtk/">
          <div className=" rounded p-2 bg-blue-400 text-white">
            Made by Sumit Kumar Rajput
          </div>
        </a>
        <button
          className="p-1 rounded bg-slate-100"
          onClick={() => {
            setData((data) => [
              ...data,
              {
                title: "addTitle",
                type: "boolean",
                isRequired: "false",
                entries: [],
                id: uuid4(),
              },
            ]);
          }}
        >
          <img src={add} width={24} height={24} />
        </button>
      </div>
      {data.map((items, idx) => (
        <DataViewComponent
          data={items}
          key={items.id}
          idx={idx + 1}
          parentId={"root__element"}
          addEntity={addEntity}
          deleteEntity={deleteEntity}
          updateEntity={updateEntity}
        />
      ))}
    </div>
  );
}

export default App;
