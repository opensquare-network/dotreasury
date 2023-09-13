import { useState } from "react";
import Container from "../../../../site/src/components/Container";
import Button from "../button";
import { flip, offset, shift, useFloating } from "@floating-ui/react";
import { useOnClickOutside } from "usehooks-ts";
import HeaderExplorer from "./explorer";

const CONTACT_LINK = "mailto:yongfeng@opensquare.network";

export default function Header() {
  const [visible, setVisible] = useState(false);
  const { refs, floatingStyles } = useFloating({
    open: visible,
    onOpenChange: setVisible,
    placement: "bottom-end",
    middleware: [offset(4), flip(), shift()],
  });

  useOnClickOutside(refs.reference, hide);

  function show() {
    setVisible(true);
  }

  function hide() {
    setVisible(false);
  }

  return (
    <header className="py-5">
      <Container className="flex justify-between items-center">
        <div>
          <a href="/">
            <img
              src="/imgs/logo-black.svg"
              alt="logo"
              className="dark:hidden"
            />
            <img
              src="/imgs/logo-white.svg"
              alt="logo"
              className="hidden dark:block"
            />
          </a>
        </div>

        <div className="flex items-center gap-x-8">
          <a href={CONTACT_LINK} className="text-textPrimary">
            Contact Us
          </a>
          <Button
            ref={refs.setReference}
            className="font-medium"
            onClick={show}
          >
            Explore Treasury
            {visible && (
              <HeaderExplorer
                ref={refs.setFloating}
                style={floatingStyles}
                className="z-10"
              />
            )}
          </Button>
        </div>
      </Container>
    </header>
  );
}
