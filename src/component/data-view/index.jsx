import React, { useEffect, useState } from "react";
import Switch from "react-switch";
import trash from "../../assets/trash.svg";
import add from "../../assets/add.svg";

export default function DataViewComponent({
  data,
  idx,
  addEntity,
  updateEntity,
  deleteEntity,
  parentId,
}) {
  const [title, setTitle] = useState(data.title);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTypeChange = (e) => {
    updateEntity(data.id, "type", e.target.value);
  };

  const handleDelete = () => {
    // console.log("parent ID", parentId);
    // console.log("element ID", data.id);
    deleteEntity(parentId, data.id);
  };

  useEffect(() => {
    updateEntity(data.id, "title", title);
  }, [title]);

  return (
    <div className="flex flex-col gap-3 mb-1 w-auto">
      <div className="flex items-center justify-between w-[672px] hover:rounded focus-within:rounded group h-12 border-b-[1px] focus-within:bg-neutral-300 hover:bg-neutral-300 border-neutral-400 py-2 px-3">
        <div className="flex h-full items-center justify-center gap-5">
          {idx && `${idx}.`}
          <input
            value={title}
            onChange={handleTitleChange}
            className="h-full w-32 focus:w-40 focus:bg-neutral-100 py-1 px-4 outline-none rounded bg-inherit transition-all text-lg font-medium text-gray-950"
          />
          <select
            value={data.type}
            onChange={handleTypeChange}
            className="bg-slate-300 uppercase font-medium tracking-wider p-1 rounded-md"
          >
            <option value={"boolean"}>boolean</option>
            <option value={"integer"}>integer</option>
            <option value={"string"}>string</option>
            <option value={"object"}>object</option>
          </select>
        </div>
        <div className="h-full items-center flex transition-all gap-4 invisible group-hover:visible group-focus:visible">
          <div className="h-full flex items-center gap-2">
            <span>Required</span>
            <Switch
              checked={data.isRequired === "true"}
              onChange={() => updateEntity(data.id, "isRequired")}
            />
          </div>
          {data.type === "object" && (
            <button
              className="p-1 rounded bg-slate-100"
              onClick={() => addEntity(data.id)}
            >
              <img src={add} width={24} height={24} />
            </button>
          )}
          <button onClick={handleDelete}>
            <img src={trash} width={24} height={24} />
          </button>
        </div>
      </div>
      {data["type"] === "object" && data.entries.length > 0 && (
        <div className="ml-8 w-full max-w-2xl">
          {data.entries.map((attribute) => (
            <DataViewComponent
              data={attribute}
              key={attribute.id}
              parentId={data.id}
              addEntity={addEntity}
              updateEntity={updateEntity}
              deleteEntity={deleteEntity}
            />
          ))}
        </div>
      )}
    </div>
  );
}
