import React, { forwardRef, useState, useEffect, useRef, useCallback } from "react";

type Unit = "%" | "px";

interface NumberFieldProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  onUnitChange?: (unit: Unit) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const NumberField = forwardRef<HTMLDivElement, NumberFieldProps>(
  (
    { value: propValue, defaultValue = 0, onChange, onUnitChange, min = 0, max = 999, step = 1, disabled = false, className = "", style, ...props },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<number>(defaultValue);
    const [displayValue, setDisplayValue] = useState<string>(defaultValue.toString());
    const [unit, setUnit] = useState<Unit>("%");
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync with controlled value
    useEffect(() => {
      if (propValue !== undefined) {
        const clampedValue = clampValue(propValue);
        setInternalValue(clampedValue);
        setDisplayValue(clampedValue.toString());
      }
    }, [propValue]);

    const clampValue = useCallback(
      (val: number): number => {
        if (isNaN(val)) return min;
        // When unit is %, clamp to 100 as max
        const effectiveMax = unit === "%" ? Math.min(max, 100) : max;
        return Math.min(Math.max(val, min), effectiveMax);
      },
      [min, max, unit]  // Add unit to dependencies
    );

    const handleUnitChange = (newUnit: Unit) => {
      setUnit(newUnit);

      // When switching from px to %, clamp value to 100 if it's larger
      if (newUnit === "%") {
        const newValue = Math.min(internalValue, 100);
        setInternalValue(newValue);
        setDisplayValue(newValue.toString());
        onChange?.(newValue);
      }

      onUnitChange?.(newUnit);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value;

      // Replace comma with dot for decimal numbers
      inputValue = inputValue.replace(/,/g, ".");

      // Remove any non-numeric characters except dot
      inputValue = inputValue.replace(/[^0-9.]/g, "");

      // Handle cases like "a123", "12a3", "123a"
      if (inputValue === "" || inputValue === ".") {
        setDisplayValue(inputValue);
        return;
      }

      // If the value is valid, update the display
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        setDisplayValue(inputValue);
      }
    };

    const handleBlur = () => {
      setIsFocused(false);

      let numValue = parseFloat(displayValue);
      if (isNaN(numValue) || displayValue === "") {
        // If input is empty or invalid, use the last valid value
        numValue = internalValue;
      }

      // Clamp the value to min/max
      const clampedValue = clampValue(numValue);

      // Update states
      setInternalValue(clampedValue);
      setDisplayValue(clampedValue.toString());

      // Notify parent if value changed
      if (clampedValue !== internalValue) {
        onChange?.(clampedValue);
      }
    };

    const handleFocus = () => {
      setIsFocused(true);
      setDisplayValue(internalValue.toString());
    };

    const increment = () => {
      const newValue = clampValue(internalValue + step);
      updateValue(newValue);
    };

    const decrement = () => {
      const newValue = clampValue(internalValue - step);
      updateValue(newValue);
    };

    const updateValue = (newValue: number) => {
      setInternalValue(newValue);
      setDisplayValue(newValue.toString());
      onChange?.(newValue);
    };

    // Disable buttons based on value
    const isDecrementDisabled = disabled || internalValue <= min;
    const isIncrementDisabled = disabled || internalValue >= (unit === "%" ? Math.min(max, 100) : max);

    return (
      <div
        ref={ref}
        className={`flex flex-col ${className} ${disabled ? "opacity-50 pointer-events-none" : ""}`}
        style={style}
        {...props}
      >
        {/* Unit toggle */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="">Unit</div>
          <div className="flex border border-neutral-700 rounded-md overflow-hidden h-10">
            <button
              type="button"
              onClick={() => handleUnitChange("%")}
              disabled={disabled}
              className={`px-2 text-base font-medium leading-[1] flex-1 flex items-center justify-center ${
                unit === "%" ? "bg-neutral-500 text-neutral-300" : "bg-neutral-800 text-neutral-300"
              } hover:bg-neutral-700`}
            >
              %
            </button>
            <button
              type="button"
              onClick={() => handleUnitChange("px")}
              disabled={disabled}
              className={`px-2 text-base font-medium leading-[1] flex-1 flex items-center justify-center ${
                unit === "px" ? "bg-neutral-500 text-neutral-300" : "bg-neutral-800 text-neutral-300"
              } hover:bg-neutral-700`}
            >
              px
            </button>
          </div>
        </div>

        {/* Input field with stepper buttons */}
        <div className="grid grid-cols-2 gap-4">
          <div className="">Value</div>
          <div className="relative flex items-center border border-neutral-700 rounded-md bg-neutral-800 overflow-hidden h-11">
            {/* Decrement button */}
            <button
              type="button"
              onClick={decrement}
              disabled={isDecrementDisabled}
              className={`h-full px-1.5 border-r border-neutral-700 w-10 flex items-center justify-center ${
                isDecrementDisabled ? "text-neutral-500 cursor-not-allowed" : "text-neutral-300 hover:bg-neutral-700 active:bg-neutral-600"
              }`}
              aria-label="Decrease value"
            >
              <svg width="16" height="16" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 5H8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={isFocused ? displayValue : internalValue}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              disabled={disabled}
              className="w-12 h-full px-1 text-center text-base flex-[1_1_auto] min-w-0 font-semibold text-neutral-100 bg-neutral-800 border-0 focus:outline-none focus:ring-0"
            />

            {/* Increment button */}
            <button
              type="button"
              onClick={increment}
              disabled={isIncrementDisabled}
              className={`h-full px-1.5 flex border-l border-neutral-700 w-10 items-center justify-center ${
                isIncrementDisabled ? "text-neutral-500 cursor-not-allowed" : "text-neutral-300 hover:bg-neutral-700 active:bg-neutral-600"
              }`}
              aria-label="Increase value"
            >
              <svg width="16" height="16" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 1.5V8.5M1.5 5H8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default NumberField;
