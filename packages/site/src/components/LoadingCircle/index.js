import { ReactComponent as LoadingSVG } from "./loading-circle.svg";

export default function LoadingCircle({ size = 24 }) {
  return <LoadingSVG width={size} height={size} />
}
