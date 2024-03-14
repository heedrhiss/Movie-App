import React from "react";

export function Loader() {
  return <p className="loader">Fetching data....!</p>;
}
export function ErrorMessage({ message }) {
  return <p className="error"><span>🚫 </span>{message}</p>;
}
