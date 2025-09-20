import React from "react"
import { cn } from "@/lib/utils"

function Slider({ 
  className, 
  defaultValue = [50], 
  max = 100, 
  min = 0, 
  step = 1, 
  onValueChange,
  ...props 
}) {
  const [value, setValue] = React.useState(defaultValue[0])
  
  const handleChange = (e) => {
    const newValue = parseInt(e.target.value)
    setValue(newValue)
    if (onValueChange) {
      onValueChange([newValue])
    }
  }

  return (
    <div className={cn("relative flex items-center w-full", className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        {...props}
      />
      <span className="ml-3 text-sm font-medium text-gray-700 min-w-[2rem]">
        {value}
      </span>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #4f46e5;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  )
}

export { Slider }