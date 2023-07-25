export const updateLocalList = data => {
  window.localStorage.setItem("list", JSON.stringify(data));
};

export const getLocalList = () => {
  const localList = window.localStorage.getItem("list");
  if (localList) {
    return JSON.parse(localList);
  } else {
    return [];
  }
};
