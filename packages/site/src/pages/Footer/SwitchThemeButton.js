import styled from "styled-components";
import {
  bg,
  border,
  border_color,
  cursor_pointer,
  flex,
  gap_x,
  hover,
  inline_flex,
  items_center,
  p,
  p_x,
  p_y,
  rounded_4,
  shadow_200,
  text_primary,
  w,
} from "../../styles/tailwindcss";
import IconMask from "../../components/Icon/Mask";
import { useDark, useThemeMode } from "../../context/theme";
import { useState } from "react";
import { flip, offset, shift, useFloating } from "@floating-ui/react";
import { p_14_medium } from "../../styles/text";
import { useOnClickOutside } from "usehooks-ts";

const FloatingItem = styled.div`
  ${flex};
  ${items_center};
  ${gap_x(8)};
  ${p_y(8)};
  ${p_x(16)};
  ${p_14_medium};
  ${text_primary};
  width: inherit;

  ${hover(bg("neutral200"))};

  span {
    text-transform: capitalize;
  }
`;
const FloatingList = styled.div`
  ${bg("neutral100")};
  ${shadow_200};
  ${rounded_4};
  ${w(140)};
  ${p_y(4)};
`;

const ButtonIcon = styled(IconMask)``;
const Button = styled.button`
  ${inline_flex};
  ${cursor_pointer};
  ${border};
  ${border_color("neutral400")};
  ${rounded_4};
  ${p(6)};
  ${bg("neutral100")};

  &:hover {
    ${ButtonIcon} {
      ${bg("textSecondary")};
    }
  }
`;

export default function FooterSwitchThemeButton() {
  const dark = useDark();
  const [, setThemeMode] = useThemeMode();

  const [visible, setVisible] = useState(false);
  const { refs, floating, reference, strategy, x, y } = useFloating({
    open: visible,
    onOpenChange: setVisible,
    placement: "top-end",
    middleware: [offset(4), flip(), shift()],
  });

  const themeList = [
    {
      icon: "/imgs/system-sun.svg",
      value: "light",
    },
    {
      icon: "/imgs/system-moon.svg",
      value: "dark",
    },
    {
      icon: "/imgs/system-computer.svg",
      value: "system",
    },
  ];

  function show() {
    setVisible(true);
  }
  function hide() {
    setVisible(false);
  }
  useOnClickOutside(refs.reference, hide);

  return (
    <Button ref={reference} onClick={show}>
      {visible && (
        <FloatingList
          ref={floating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
        >
          {themeList.map((item) => (
            <FloatingItem
              key={item.value}
              role="button"
              onClick={() => setThemeMode(item.value)}
            >
              <IconMask src={item.icon} size={20} color="textDisable" />
              <span>{item.value}</span>
            </FloatingItem>
          ))}
        </FloatingList>
      )}

      <ButtonIcon
        src={dark ? "/imgs/system-sun.svg" : "/imgs/system-moon.svg"}
        size={20}
        color={visible ? "textSecondary" : "textDisable"}
      />
    </Button>
  );
}
