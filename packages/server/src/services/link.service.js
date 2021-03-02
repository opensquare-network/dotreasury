const { getLinkCollection } = require("../mongo-admin");
const { isValidSignature } = require("../utils");
const { HttpError } = require("../exc");
const { decodeAddress } = require("@polkadot/util-crypto");

let admins = null;
async function checkAdmin(address) {
  if (!admins) {
    admins = (process.env.ADMINS || "")
      .split("|")
      .filter((addr) => addr !== "")
      .map((addr) => decodeAddress(addr));
  }
  const lookup = decodeAddress(address);
  return admins.some((admin) => Buffer.compare(admin, lookup) === 0);
}

class LinkService {
  async getLinks({ indexer, getReason }) {
    const linkCol = await getLinkCollection();
    const links = await linkCol.findOne({ indexer });

    if (links && links.inReasonExtracted) {
      return links?.links ?? [];
    }

    if (getReason) {
      const reason = await getReason();
      if (reason) {
        // Pull existing inReason links before re-push
        await linkCol.updateOne(
          { indexer },
          {
            $pull: {
              links: {
                inReasons: true,
              },
            },
          }
        );

        // Extract all links that present in reason text
        const urlRegex = /(https?:\/\/[^ ]+)/g;
        let match;
        while ((match = urlRegex.exec(reason))) {
          const inReasonLink = match[1];

          await linkCol.updateOne(
            { indexer },
            {
              $push: {
                links: {
                  link: inReasonLink,
                  description: "",
                  inReasons: true,
                },
              },
            },
            { upsert: true }
          );
        }

        // Remember that the inReason links has been processed
        await linkCol.updateOne(
          { indexer },
          {
            $set: {
              inReasonExtracted: true,
            },
          },
          { upsert: true }
        );
      }
    }

    const updatedTipLinks = await linkCol.findOne({ indexer });

    return updatedTipLinks?.links ?? [];
  }

  async verifySignature(addressAndSignature, message) {
    if (!addressAndSignature) {
      throw new HttpError(400, "Signature is missing");
    }

    const [address, signature] = addressAndSignature.split("/");
    if (!address || !signature) {
      throw new HttpError(400, "Signature is invalid");
    }

    const isAdmin = await checkAdmin(address);
    if (!isAdmin) {
      throw new HttpError(401, "Unauthorized");
    }

    const isValid = isValidSignature(message, signature, address);
    if (!isValid) {
      throw new HttpError(400, "Signature is invalid");
    }

    return true;
  }

  async createLink({ indexer, link, description }, addressAndSignature) {
    await this.verifySignature(
      addressAndSignature,
      JSON.stringify({ ...indexer, link, description })
    );

    const linkCol = await getLinkCollection();
    await linkCol.updateOne(
      { indexer },
      {
        $push: {
          links: {
            link,
            description,
            inReasons: false,
          },
        },
      },
      { upsert: true }
    );

    return true;
  }

  async deleteLink({ indexer, linkIndex }, addressAndSignature) {
    await this.verifySignature(
      addressAndSignature,
      JSON.stringify({ ...indexer, linkIndex })
    );

    const linkCol = await getLinkCollection();
    await linkCol.updateOne(
      {
        indexer,
        [`links.${linkIndex}.inReasons`]: false,
      },
      {
        $unset: {
          [`links.${linkIndex}`]: 1,
        },
      }
    );

    await linkCol.updateOne(
      { indexer },
      {
        $pull: {
          links: null,
        },
      }
    );

    return true;
  }
}

module.exports = new LinkService();
