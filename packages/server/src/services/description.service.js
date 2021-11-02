const { getDescriptionCollection } = require("../mongo-admin");
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

class DescriptionService {
  async getDescription({ indexer }) {
    const descriptionCol = await getDescriptionCollection();
    const description = await descriptionCol.findOne({ indexer });

    return description ?? {};
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

  async setDescription({ indexer, description }, addressAndSignature) {
    await this.verifySignature(
      addressAndSignature,
      JSON.stringify({ ...indexer, description })
    );

    const descriptionCol = await getDescriptionCollection();
    await descriptionCol.updateOne(
      { indexer },
      {
        $set: {
          description,
        },
      },
      { upsert: true }
    );

    return true;
  }
}

module.exports = new DescriptionService();
