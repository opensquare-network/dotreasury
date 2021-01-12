const { getLinkCollection } = require("../mongo-admin");
const { isValidSignature } = require("../utils");
const { HttpError } = require("../exc");

async function checkAdmin(address) {
  return true;
}

class LinkService {
  async getLinks({ type, indexer, getReason }) {
    const linkCol = await getLinkCollection();
    const links = await linkCol.findOne({
      type,
      indexer,
    });

    if (links && links.inReasonExtracted) {
      return links?.links ?? [];
    }

    if (getReason) {
      const reason = await getReason();
      if (reason) {
        // Pull existing inReason links before re-push
        await linkCol.updateOne({
          type,
          indexer,
        }, {
          $pull: {
            links: {
              inReasons: true,
            }
          }
        });

        // Extract all links that present in reason text
        const urlRegex = /(https?:\/\/[^ ]*)/g;
        let match;
        while (match = urlRegex.exec(reason)) {
          const inReasonLink = match[1];

          await linkCol.updateOne({
            type,
            indexer,
          }, {
            $push: {
              links: {
                link: inReasonLink,
                description: "",
                inReasons: true,
              }
            }
          }, { upsert: true });
        }

        // Remember that the inReason links has been processed
        await linkCol.updateOne({
          type,
          indexer,
        }, {
          $set: {
            inReasonExtracted: true,
          },
        }, { upsert: true });

      }
    }

    const updatedTipLinks = await linkCol.findOne({
      type,
      indexer,
    });

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

  async createLink({ type, indexer, link, description }, addressAndSignature) {
    await this.verifySignature(addressAndSignature, JSON.stringify({ type, index: indexer, link, description }));

    const linkCol = await getLinkCollection();
    await linkCol.updateOne({
      type,
      indexer,
    }, {
      $push: {
        links: {
          link,
          description,
          inReasons: false,
        }
      }
    }, { upsert: true });

    return true;
  }

  async deleteLink({ type, indexer, linkIndex }, addressAndSignature) {
    await this.verifySignature(addressAndSignature, JSON.stringify({ type, index: indexer, linkIndex }));

    const linkCol = await getLinkCollection();
    await linkCol.updateOne({
      type,
      indexer,
    }, {
      $unset: {
        [`links.${linkIndex}`]: 1
      }
    });

    await linkCol.updateOne({
      type,
      indexer,
    }, {
      $pull: {
        links: null
      }
    });

    return true;
  }
}

module.exports = new LinkService();
