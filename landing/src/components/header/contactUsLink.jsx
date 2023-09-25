import ExternalLink from "@site/src/components/ExternalLink";

const CONTACT_LINK = "https://t.me/dotreasury";

export default function ContactUsLink() {
  return (
    <ExternalLink
      href={CONTACT_LINK}
      className="text-textPrimary hover:text-textPrimary"
    >
      Contact Us
    </ExternalLink>
  );
}
