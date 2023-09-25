import { useState } from "react";
import Container from "@site/src/components/Container";
import Button from "../button";
import { flip, offset, shift, useFloating } from "@floating-ui/react";
import { useOnClickOutside } from "usehooks-ts";
import HeaderExplorer from "./explorer";
import { cn } from "../../utils";
import IconMask from "@site/src/components/Icon/Mask";
import ExternalLink from "@site/src/components/ExternalLink";

const CONTACT_LINK = "https://t.me/dotreasury";

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
    <header className="py-5 max-md:px-6">
      <Container
        className={cn(
          "flex justify-between items-center",
          "max-md:!m-0",
          "max-w-[inherit] max-md:!w-full",
        )}
      >
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

        <div className="flex">
          <div className={cn("flex items-center gap-x-8", "max-sm:hidden")}>
            <ExternalLink
              href={CONTACT_LINK}
              className="text-textPrimary hover:text-textPrimary"
            >
              Contact Us
            </ExternalLink>
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

          <div className="hidden max-sm:block">
            <IconMask
              src="/imgs/icon-ham-black.svg"
              color="textPrimary"
              size={24}
              alt="menu"
            />
          </div>
        </div>
      </Container>
    </header>
  );
}
