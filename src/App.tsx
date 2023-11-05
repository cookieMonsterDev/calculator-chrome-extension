import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>{count}</div>
      <button onClick={() => setCount((prev) => ++prev)}>Add</button>
    </>
  );
}

export default App;
