import Username from "../../../site/src/components/User/Username";
import Avatar from "../../../site/src/components/User/Avatar";
import Badge from "../../../site/src/components/User/Badge";
import { useIdentity } from "../hooks/use-identity";
import DeletedAccount from "../../../site/src/components/User/DeletedAccount";
import ExternalLink from "../../../site/src/components/ExternalLink";

export default function User({
  address,
  ellipsis = true,
  popup = true,
  popupContent,
  avatarSize = 22,
  noLink = false,
  chain,
  role = "",
}) {
  const { name, badgeData } = useIdentity(chain, address);

  let username = (
    <Username
      name={name}
      address={address}
      ellipsis={ellipsis}
      popup={popup}
      popupContent={popupContent}
      noLink={noLink}
    />
  );

  if (!noLink) {
    username = (
      <ExternalLink
        href={`https://${chain}.dotreasury.com/users/${address}/${role}`}
      >
        {username}
      </ExternalLink>
    );
  }

  return (
    <>
      {address ? (
        <div className="flex items-center overflow-hidden max-w-[inherit] truncate space-x-2">
          <Avatar address={address} size={avatarSize} />
          <div className="flex items-center truncate">
            <Badge {...badgeData} />
            {username}
          </div>
        </div>
      ) : (
        <DeletedAccount />
      )}
    </>
  );
}
