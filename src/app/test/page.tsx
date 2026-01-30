"use client";
import React from "react";

function Test() {
  const [Option1, setOption1] = React.useState("");
  const [Option2, setOption2] = React.useState("");
  const [Option3, setOption3] = React.useState("");
  return (
    <div>
      <select
        name="options"
        value={Option1}
        onChange={(e) => setOption1(e.target.value)}
        id="options"
      >
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </select>

      <p>Selected Option: {Option1}</p>
    </div>
  );
}

export default Test;
