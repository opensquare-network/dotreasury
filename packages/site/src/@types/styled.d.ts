import "styled-components";
import { light } from "../styles/theme";

declare module "styled-components" {
  type Theme = typeof light;

  export function useTheme(): Theme;
}
