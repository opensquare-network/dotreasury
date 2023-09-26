export function HeaderLogo() {
  return (
    <div>
      <a href="/">
        <img src="/imgs/logo-black.svg" alt="logo" className="dark:hidden" />
        <img
          src="/imgs/logo-white.svg"
          alt="logo"
          className="hidden dark:block"
        />
      </a>
    </div>
  );
}
