import NextImage from "next/image";
import { STATIC_PATH } from "../lib/helpers/constants";

export default function Image({ ...props }) {
  return (
    <NextImage src={`${STATIC_PATH}${props.src}`} alt={props.alt} {...props} />
  );
}
