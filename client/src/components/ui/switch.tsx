import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const switchVariants = cva(
  "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-[1.2rem] w-10",
        sm: "h-[1rem] w-7",
        lg: "h-[1.5rem] w-12",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const thumbVariants = cva(
  "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block rounded-full ring-0 transition-transform",
  {
    variants: {
      size: {
        default: "size-4 data-[state=unchecked]:translate-x-[1px] data-[state=checked]:translate-x-[calc(128%)]",
        sm: "size-3 data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-[calc(110%)]",
        lg: "size-5 data-[state=unchecked]:translate-x-[1px] data-[state=checked]:translate-x-[calc(122%)]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & VariantProps<typeof switchVariants>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        switchVariants({ size }),
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(thumbVariants({ size }))}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
