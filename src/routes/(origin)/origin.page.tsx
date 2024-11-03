import { useServerSideQuery } from "rakkasjs";
import { useState } from "react";

export default function OriginPage() {
  const [counter, setCounter] = useState(0);

  const { data } = useServerSideQuery(
    () => {
      return RAKKAS_BUILD_TYPE;
    },
    {
      uniqueId: "origin-build-type",
    },
  );

  return (
    <main>
      <h1>Hello from origin page!</h1>
      <p>
        I was rendered on the <b>{data}</b>
      </p>
      <p>
        <button
          onClick={() => {
            setCounter((old) => old + 1);
          }}
        >
          Clicked {counter} times
        </button>
      </p>
    </main>
  );
}
