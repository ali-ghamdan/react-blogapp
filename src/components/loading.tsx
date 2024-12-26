import { useState } from "react";

export default function Loading() {
  const [points, setPoints] = useState(0);
  setInterval(() => {
    setPoints(points % 3 + 1)
  }, 500)
  return (
    <div className="flex justify-center mt-5"><h1>LOADING {".".repeat(points)}</h1></div>
  )
}
