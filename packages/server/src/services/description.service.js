const { getDescriptionCollection } = require("../mongo-admin");
const { verifyAdminSignature, ADMINS } = require("../utils");

class DescriptionService {
  async getDescription({ indexer }) {
    const descriptionCol = await getDescriptionCollection();
    const description = await descriptionCol.findOne({ indexer });

    return description ?? {};
  }

  async setDescription({ indexer, description, proposalType, status }, addressAndSignature, admins = ADMINS) {
    await verifyAdminSignature(
      addressAndSignature,
      JSON.stringify({ ...indexer, description, proposalType, status }),
      admins,
    );

    const descriptionCol = await getDescriptionCollection();
    await descriptionCol.updateOne(
      { indexer },
      {
        $set: {
          description,
          tags: {
            proposalType,
            status,
          },
        },
      },
      { upsert: true }
    );

    return true;
  }
}

module.exports = new DescriptionService();
