import Container from "../../../site/src/components/Container";
import ButtonPrimary from "../../../site/src/components/ButtonPrimary";

export default function Header() {
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
          <a
            href="mailto:yongfeng@opensquare.network"
            className="text-textPrimary"
          >
            Contact Us
          </a>
          <ButtonPrimary className="!font-medium">
            Explore Treasury
          </ButtonPrimary>
        </div>
      </Container>
    </header>
  );
}
