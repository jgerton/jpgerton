import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control } from "react-hook-form";
import type { ContactFormData } from "@/lib/validations/contact-schema";

interface HoneypotFieldProps {
  control: Control<ContactFormData>;
}

export function HoneypotField({ control }: HoneypotFieldProps) {
  return (
    <FormField
      control={control}
      name="honeypot"
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
