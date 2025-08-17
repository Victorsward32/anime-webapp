import React, { useEffect, useState } from "react";
import "../../scss/components/dropDown.scss";

const DropDown = ({ arr = [] ,onChange  }) => {
  const [selected, setSelected] = useState(arr[0]);
  useEffect(() => {
    if (onChange) {
      onChange(selected);
    }
  }, [selected, onChange]);
  return (
    <div data-component="DropDownComponent" className="dropDown">
      <select
        name="select"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="select-container"
      >
        {arr.map((item, index) => {
          return (
            <option key={index} value={item}>
              {item}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default React.memo(DropDown);