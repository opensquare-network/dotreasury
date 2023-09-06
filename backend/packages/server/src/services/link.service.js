const { getLinkCollection } = require("../mongo-admin");
const { verifyAdminSignature, ADMINS } = require("../utils");

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

  async createLink({ indexer, link, description }, addressAndSignature, admins = ADMINS) {
    await verifyAdminSignature(
      addressAndSignature,
      JSON.stringify({ ...indexer, link, description }),
      admins,
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

  async deleteLink({ indexer, linkIndex }, addressAndSignature, admins = ADMINS) {
    await verifyAdminSignature(
      addressAndSignature,
      JSON.stringify({ ...indexer, linkIndex }),
      admins,
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
