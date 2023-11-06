import { useReducer } from "react";
import { Display } from "./display";
import { Button } from "./buttons";

interface CalculatorState {
  value: number | null;
  displayValue: string;
  operator: string | null;
  waitingForOperand: boolean;
}

type CalculatorAction = {
  type:
    | "inputDigit"
    | "inputDot"
    | "toggleSign"
    | "inputPercent"
    | "performOperation"
    | "clearAll"
    | "clearDisplay"
    | "clearLastChar";
  payload?: any;
};

const CalculatorOperations: {
  [key: string]: (prevValue: number, nextValue: number) => number;
} = {
  "/": (prevValue, nextValue) => prevValue / nextValue,
  "*": (prevValue, nextValue) => prevValue * nextValue,
  "+": (prevValue, nextValue) => prevValue + nextValue,
  "-": (prevValue, nextValue) => prevValue - nextValue,
  "=": (nextValue) => nextValue,
};

const initState: CalculatorState = {
  value: null,
  displayValue: "0",
  operator: null,
  waitingForOperand: false,
};

const reducer = (state: CalculatorState, action: CalculatorAction) => {
  switch (action.type) {
    case "inputDigit": {
      console.log(action);

      if (state.waitingForOperand) {
        return {
          ...state,
          displayValue: String(action.payload),
          waitingForOperand: false,
        };
      }
      console.log(state);

      return {
        ...state,
        displayValue:
          state.displayValue === "0"
            ? String(action.payload)
            : state.displayValue + action.payload,
      };
    }
    case "inputDot": {
      const { displayValue } = state;

      if (!/\./.test(displayValue)) {
        return {
          ...state,
          displayValue: displayValue + ".",
          waitingForOperand: false,
        };
      }

      return state;
    }
    case "toggleSign": {
      const { displayValue } = state;
      const newValue = parseFloat(displayValue) * -1;

      return { ...state, displayValue: String(newValue) };
    }
    case "inputPercent": {
      const { displayValue } = state;
      const currentValue = parseFloat(displayValue);

      if (currentValue === 0) return state;

      const fixedDigits = displayValue.replace(/^-?\d*\.?/, "");
      const newValue = parseFloat(displayValue) / 100;

      return {
        ...state,
        displayValue: String(newValue.toFixed(fixedDigits.length + 2)),
      };
    }
    case "performOperation": {
      const { value, displayValue, operator } = state;
      const inputValue = parseFloat(displayValue);

      const newState = { ...state };

      if (value == null) {
        newState.value = inputValue;
      }

      if (operator) {
        const currentValue = value || 0;
        const newValue = CalculatorOperations[operator](
          currentValue,
          inputValue
        );

        newState.value = newValue;
        newState.displayValue = String(newValue);
      }

      newState.waitingForOperand = true;
      newState.operator = action.payload;

      return newState;
    }
    case "clearAll": {
      return {
        value: null,
        displayValue: "0",
        operator: null,
        waitingForOperand: false,
      };
    }
    case "clearDisplay": {
      return {
        ...state,
        displayValue: "0",
      };
    }
    case "clearLastChar": {
      const { displayValue } = state;

      return {
        ...state,
        displayValue: displayValue.substring(0, displayValue.length - 1) || "0",
      };
    }
    default:
      return state;
  }
};

export const Calculator: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initState);

  const { displayValue } = state;
  const clearDisplay = displayValue !== "0";
  const clearText = clearDisplay ? "C" : "AC";

  return (
    <>
      <div className="mb-1">
      <Display value={displayValue} />
      </div>
      <div className="grid grid-cols-4 gap-[0.2rem]">
        <Button
          onClick={() =>
            clearDisplay
              ? dispatch({ type: "clearDisplay" })
              : dispatch({ type: "clearAll" })
          }
        >
          {clearText}
        </Button>
        <Button onClick={() => dispatch({ type: "toggleSign" })}>±</Button>
        <Button onClick={() => dispatch({ type: "inputPercent" })}>%</Button>
        <Button
          onClick={() => dispatch({ type: "performOperation", payload: "/" })}
        >
          ÷
        </Button>
        <Button onClick={() => dispatch({ type: "inputDigit", payload: 7 })}>
          7
        </Button>
        <Button onClick={() => dispatch({ type: "inputDigit", payload: 8 })}>
          8
        </Button>
        <Button onClick={() => dispatch({ type: "inputDigit", payload: 9 })}>
          9
        </Button>
        <Button
          onClick={() => dispatch({ type: "performOperation", payload: "*" })}
        >
          ×
        </Button>
        <Button onClick={() => dispatch({ type: "inputDigit", payload: 4 })}>
          4
        </Button>
        <Button onClick={() => dispatch({ type: "inputDigit", payload: 5 })}>
          5
        </Button>
        <Button onClick={() => dispatch({ type: "inputDigit", payload: 6 })}>
          6
        </Button>
        <Button
          onClick={() => dispatch({ type: "performOperation", payload: "-" })}
        >
          −
        </Button>
        <Button onClick={() => dispatch({ type: "inputDigit", payload: 1 })}>
          1
        </Button>
        <Button onClick={() => dispatch({ type: "inputDigit", payload: 2 })}>
          2
        </Button>
        <Button onClick={() => dispatch({ type: "inputDigit", payload: 3 })}>
          3
        </Button>
        <Button
          onClick={() => dispatch({ type: "performOperation", payload: "+" })}
        >
          +
        </Button>
        <Button
          onClick={() => dispatch({ type: "inputDigit", payload: 0 })}
          className="col-span-2"
        >
          0
        </Button>
        <Button
          onClick={() =>
            dispatch({
              type: "inputDot",
            })
          }
        >
          ●
        </Button>
        <Button
          onClick={() => dispatch({ type: "performOperation", payload: "=" })}
        >
          =
        </Button>
      </div>
    </>
  );
};
