import React, { useState } from "react";
import { useDebounce, useThrottle } from "react-relaxed";

const App = () => {
  const [value, setValue] = useState("Initial value");
  const [debouncedValue] = useDebounce(value, 500);
  const [throttledValue] = useThrottle(value, 500);

  return (
    <div className="app">
      <div className="content">
        <div className="header">
          <h1>react-relaxed Demo</h1>
          <p>noahflk/react-relaxed</p>
          <input value={value} onChange={(event) => setValue(event.target.value)} />
        </div>
        <table>
          <tr>
            <th>Realtime:</th>
            <td>{value}</td>
          </tr>
          <tr>
            <th>Debounced:</th>
            <td>{debouncedValue}</td>
          </tr>
          <tr>
            <th>Throttled:</th>
            <td>{throttledValue}</td>
          </tr>
        </table>
      </div>
    </div>
  );
};
export default App;
