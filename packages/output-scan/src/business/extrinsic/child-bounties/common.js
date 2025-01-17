function isChildBountyFinished(childBountyId, events) {
  return events.some((e) => {
    const { section, method, data } = e.event;
    if ("childBounties" !== section) {
      return false;
    } else if (["Claimed", "Awarded"].includes(method)) {
      return data[1].toNumber() === childBountyId;
    } else if ("Canceled" !== method) {
      return data[1].toNumber() === childBountyId;
    }
  });
}

module.exports = {
  isChildBountyFinished,
}
