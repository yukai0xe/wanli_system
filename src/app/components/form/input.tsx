import InputStyles from "@/assets/styles/components/input.module.css";

interface inputProps {
  id?: string;
  name?: string;
  type: string;
  label?: string;
  placeholder?: string;
  value?: string;
  inputChangeHandler: (v: string) => void;
}

const InputComponent = ({ item, nolabel=false, direction=false }: { item: inputProps, nolabel?: boolean, direction?: boolean }) => {
    return (
      <div
        className={`mt-3 ${
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
            {item.label}
          </label>
        )}
        <div className={`mt-2 ${nolabel ? "w-full" : "w-1/2"}`}>
          <input
            id={item.id}
            name={item.name}
            type={item.type}
            className={InputStyles.customInput}
            value={item.value}
            placeholder={item.placeholder}
            onChange={(e) => item.inputChangeHandler(e.currentTarget.value)}
          />
        </div>
      </div>
    );
}

export default InputComponent;