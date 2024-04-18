import { ChangeEvent } from "react";

interface SliderProps {
  onchange: Function;
  max: number;
  min: number;
  step: number;
  defaultval: number;
}

export default function SliderComponent({ onchange, max, min, step, defaultval }: SliderProps) {
  //const [value, setValue] = useState(defaultval);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log("current val: " + event.target.value);
    onchange(event.target.value);
    //setValue(Number(event.target.value));
  };
  return (
    <div className="slidercomponent">
      <h6 className="slidertitle">Solving speed</h6>
      <div className="sliderwrapper">
        <input
          id="slider"
          type="range"
          min={min}
          max={max}
          step={step}
          defaultValue={defaultval}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
