const { getLinkCollection } = require("../mongo-admin");
const { isValidSignature } = require("../utils");

async function checkAdmin(address) {
  return true;
}

class LinkService {
  async getLinks(ctx, { type, indexer, getReason }) {
    const linkCol = await getLinkCollection();
    const links = await linkCol.findOne({
      type,
      indexer,
    });

    if (links && links.inReasonExtracted) {
      ctx.body = links?.links ?? [];
      return;
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

    ctx.body = updatedTipLinks?.links ?? [];
  }

  async verifySignature(ctx, message) {
    if (!ctx.request.headers.signature) {
      ctx.status = 400;
      return false;
    }

    const [address, signature] = ctx.request.headers.signature.split("/");
    if (!address || !signature) {
      ctx.status = 400;
      return false;
    }

    const isAdmin = await checkAdmin(address);
    if (!isAdmin) {
      ctx.status = 401;
      return false;
    }

    const isValid = isValidSignature(message, signature, address);

    if (!isValid) {
      ctx.status = 400;
      return false;
    }

    return true;
  }

  async createLink(ctx, { type, indexer, link, description }) {
    const success = await this.verifySignature(ctx, JSON.stringify({ type, index: indexer, link, description }));
    if (!success) {
      return;
    }

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

    ctx.body = true;
  }

  async deleteLink(ctx, { type, indexer, linkIndex }) {
    const success = await this.verifySignature(ctx, JSON.stringify({ type, index: indexer, linkIndex }));
    if (!success) {
      return;
    }

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

    ctx.body = true;
  }
}

module.exports = new LinkService();
