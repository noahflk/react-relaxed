import React, { useState } from "react";
import { useDebounce, useThrottle } from "react-relaxed";

const App = () => {
  const [value, setValue] = useState("initial value");
  const [debouncedValue] = useDebounce(value, 500);
  const [throttledValue] = useThrottle(value, 500);

  return (
    <div className="app">
      <div>
        <input value={value} onChange={(event) => setValue(event.target.value)} />
        <table>
          <tr>
            <th>Regular Value:</th>
            <td>{value}</td>
          </tr>
          <tr>
            <th>Debounced Value:</th>
            <td>{throttledValue}</td>
          </tr>
          <tr>
            <th>Throttled Value:</th>
            <td>{debouncedValue}</td>
          </tr>
        </table>
      </div>
    </div>
  );
};
export default App;
