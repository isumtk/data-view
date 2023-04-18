import { useCallback } from "react";
import uuid4 from "uuid4";

// function to generate Dummy Data with unique ids
function generateData(entries) {
  return entries.map((entry) => {
    const id = uuid4();
    const subEntries = generateData(entry.entries);
    return { ...entry, id, entries: subEntries };
  });
}

// function to toggle the isRequired field
function updateIsRequired(entry, id) {
  if (entry.id === id) {
    return {
      ...entry,
      isRequired: entry.isRequired === "false" ? "true" : "false",
    };
  }
  if (entry.type === "object" && entry.entries.length > 0) {
    const subEntries = entry.entries.map((subEntry) =>
      updateIsRequired(subEntry, id)
    );

    return { ...entry, entries: subEntries };
  }

  return entry;
}

// function to change the title of the field
function updateTitle(entry, id, value) {
  if (entry.id === id) {
    return {
      ...entry,
      title: value,
    };
  }
  if (entry.type === "object" && entry.entries.length > 0) {
    const subEntries = entry.entries.map((subEntry) =>
      updateTitle(subEntry, id, value)
    );

    return { ...entry, entries: subEntries };
  }

  return entry;
}

// function to change the type of field
function updateType(entry, id, value) {
  if (entry.id === id) {
    return {
      ...entry,
      entries: [],
      type: value,
    };
  }
  if (entry.type === "object" && entry.entries.length > 0) {
    const subEntries = entry.entries.map((subEntry) =>
      updateType(subEntry, id, value)
    );

    return { ...entry, entries: subEntries };
  }

  return entry;
}

// Wrapper function for all update events
function update(data, id, key, value) {
  if (key === "isRequired") {
    return data.map((entry) => updateIsRequired(entry, id));
  }

  if (key === "title") {
    return data.map((entry) => updateTitle(entry, id, value));
  }

  if (key === "type") {
    return data.map((entry) => updateType(entry, id, value));
  }
}

// function to fetch the Object of the given id
function findObject(parentId, data) {
  for (const attribute of data) {
    if (attribute.id === parentId && attribute.type === "object") {
      return attribute;
    }
    const subAttribute = findObject(parentId, attribute.entries);
    if (subAttribute) {
      return subAttribute;
    }
  }

  return null;
}

// useEntity hook to warp all CRUD operations
const useEntity = (setEntities) => {
  // function to add entity
  const addEntity = useCallback(
    (id) => {
      const defaultData = {
        title: "addTitle",
        type: "boolean",
        isRequired: "false",
        entries: [],
        id: uuid4(),
      };
      // console.log("addEntity called", id);
      setEntities((data) => {
        const currentObject = findObject(id, data);
        const existingEntry = currentObject.entries.find(
          (entry) => entry.id === defaultData.id
        );
        if (existingEntry) {
          return data;
        }
        currentObject.entries.push(defaultData);
        return [...data];
      });
    },
    [setEntities]
  );

  // function to delete entity
  const deleteEntity = useCallback(
    (parentID, elementID) => {
      if (parentID === "root__element") {
        setEntities((data) => data.filter((attr) => attr.id !== elementID));
        return;
      }
      // if parentID !== "root_element"
      setEntities((data) => {
        const parentObject = findObject(parentID, data);
        parentObject.entries = parentObject.entries.filter(
          (attr) => attr.id !== elementID
        );
        return [...data];
      });
    },
    [setEntities]
  );

  // function to update entity
  const updateEntity = useCallback(
    (id, key, value) => {
      setEntities((data) => update(data, id, key, value));
    },
    [setEntities]
  );

  return { addEntity, deleteEntity, updateEntity };
};

export default useEntity;
