import { useState } from "react";
import Container from "@site/src/components/Container";
import Button from "../button";
import { flip, offset, shift, useFloating } from "@floating-ui/react";
import { useOnClickOutside } from "usehooks-ts";
import HeaderExplorer from "./explorer";
import { cn } from "../../utils";
import IconMask from "@site/src/components/Icon/Mask";
import { HeaderLogo } from "./logo";
import HeaderExplorerMobile from "./explorerMobile";
import ContactUsLink from "./contactUsLink";
import { useWindowSize } from "react-use";
import { useEffect } from "react";

export default function Header() {
  const [visible, setVisible] = useState(false);
  const [mobileExplorerVisible, setMobileExplorerVisible] = useState(false);
  const windowSize = useWindowSize();

  const { refs, floatingStyles } = useFloating({
    open: visible,
    onOpenChange: setVisible,
    placement: "bottom-end",
    middleware: [offset(4), flip(), shift()],
  });

  useOnClickOutside(refs.reference, hide);

  useEffect(() => {
    setMobileExplorerVisible(false);
  }, [windowSize.width]);

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
        <HeaderLogo />

        <div className="flex">
          <div className={cn("flex items-center gap-x-8", "max-sm:hidden")}>
            <ContactUsLink />
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

          <div className="hidden max-sm:flex">
            <IconMask
              role="button"
              src="/imgs/icon-ham-black.svg"
              color="textPrimary"
              size={24}
              alt="menu"
              onClick={() => {
                setMobileExplorerVisible(true);
              }}
            />
          </div>
        </div>
      </Container>

      {mobileExplorerVisible && (
        <HeaderExplorerMobile
          setMobileExplorerVisible={setMobileExplorerVisible}
        />
      )}
    </header>
  );
}
