import InputStyles from "@/assets/styles/components/input.module.css";

interface inputProps {
  id?: string;
  name?: string; 
  label?: string;
  placeholder?: string;
  nolabel?: boolean
  direction?: boolean
  input: InputObject
  value?: string | boolean,
  inputChangeHandler: (v: string) => void
}

const renderInput = (item: inputProps) => {
  switch (item.input.type) {
    case "select":
      return (
        <select
          value={item.value as string}
          onChange={(e) => item.inputChangeHandler(e.currentTarget.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
        >
          {item.input.value.map((opt, idx) => (
            <option key={idx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    case "checkbox":
      return (
        <input
          id={item.id}
          name={item.name}
          type="checkbox"
          checked={item.value === "true"}
          onChange={(e) =>
            item.inputChangeHandler(e.currentTarget.checked ? "true" : "false")
          }
        />
      );
    case "date":
    case "text":
      return (
        <input
          id={item.id}
          name={item.name}
          type={item.input.type}
          className={InputStyles.customInput}
          value={item.value as string}
          placeholder={item.placeholder}
          onChange={(e) => item.inputChangeHandler(e.currentTarget.value)}
        />
      );
  }
};

const InputComponent = ({
  id, name, label, placeholder, input, value, inputChangeHandler,
  nolabel = false,
  direction = false
}: inputProps) => {
    return (
      <div
        className={`${
          direction
            ? "flex gap-x-3 items-center justify-between"
            : "sm:col-span-3"
        }`}
      >
        {!nolabel && (
          <label
            htmlFor="more-day-start"
            className="block text-sm/6 font-medium text-gray-900"
          >
            {label}
          </label>
        )}
        <div className={`mt-2 ${nolabel ? "w-full" : "w-1/2"}`}>
          {renderInput({id, name, label, placeholder, input, value, inputChangeHandler})}
        </div>
      </div>
    );
}

export default InputComponent;