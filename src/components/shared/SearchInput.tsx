import type React from "react";
import { Input } from "../ui/input";

interface Props extends React.ComponentProps<"input"> {
  label?: string;
}

export default function SearchInput({ ...inputProps }: Props) {
  return <Input type="text" {...inputProps} />;
}
