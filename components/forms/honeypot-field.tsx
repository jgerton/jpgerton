import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control, FieldValues, Path } from "react-hook-form";

interface HoneypotFieldProps<T extends FieldValues> {
  control: Control<T>;
  name?: Path<T>;
}

export function HoneypotField<T extends FieldValues>({
  control,
  name = "honeypot" as Path<T>,
}: HoneypotFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className="absolute -left-[9999px] -top-[9999px]"
          aria-hidden="true"
        >
          <FormControl>
            <Input
              {...field}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              placeholder="Leave this field empty"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
