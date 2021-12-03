const {
  setApi, setProvider,
  specs: { setSpecHeights }
} = require("@dotreasury/common");
const { getTipReason } = require("../utils");
const { getTipMetaFromStorage } = require("../utils");
jest.setTimeout(3000000);

const { ApiPromise, WsProvider } = require("@polkadot/api");

async function testTipData(api, height, hash, toTestMeta) {
  await setSpecHeights([height]);
  const blockHash = await api.rpc.chain.getBlockHash(height);

  const meta = await getTipMetaFromStorage(blockHash, hash);
  expect(meta).toEqual(toTestMeta);
}

describe("test get tip", () => {
  let api;
  let provider;

  beforeAll(async () => {
    provider = new WsProvider("wss://pub.elara.patract.io/kusama", 1000);
    api = await ApiPromise.create({ provider, });

    setProvider(provider)
    setApi(api);
  });

  afterAll(async () => {
    await provider.disconnect();
  });

  test("meta works", async () => {
    await testTipData(api, 602672, "0x3a8576a1d7f9110e5d13d512bb8374bc0843da026dead68707462bb7f3e448b1", {
      "reason": "0xed3ce0d332276bfa17c27431bac4d8bf1807cbbe114b0c5b1cbf0e7dc07ace47",
      "who": "HEkh52pShreLjbiGuewsnbXTeXFiq5mxqF3TffeHRjsbuN5",
      "finder": null,
      "closes": null,
      "tips": [
        [
          "FcxNWVy5RESDsErjwyZmPCW6Z8Y3fbfLzmou34YZTrbcraL",
          50000000000000
        ]
      ]
    })

    await testTipData(api, 714498, "0xfe924943bb8acb5a28f4a37660d88f4262daa01b6234c393fb8b3fc315fd5429", {
      "reason": "0xa53a248c55528c3f5fa6724edcbdf11e2c19e9d9f7ea6b72bf2883d2be15e250",
      "who": "FoBryanE4CffsqaC7P3hC88N1cGx9fUBvJZXvikC8JxX3e1",
      "finder": [
        "GNdebyJH2tfL5SWB7Tf3ncGUKVqnMf9JQJ5bwrL4dK22XuE",
        1750000000000
      ],
      "closes": null,
      "tips": []
    })

    await testTipData(api, 717861, "0xfe924943bb8acb5a28f4a37660d88f4262daa01b6234c393fb8b3fc315fd5429", {
      "reason": "0xa53a248c55528c3f5fa6724edcbdf11e2c19e9d9f7ea6b72bf2883d2be15e250",
      "who": "FoBryanE4CffsqaC7P3hC88N1cGx9fUBvJZXvikC8JxX3e1",
      "finder": [
        "GNdebyJH2tfL5SWB7Tf3ncGUKVqnMf9JQJ5bwrL4dK22XuE",
        1750000000000
      ],
      "closes": null,
      "tips": [
        [
          "H9eSvWe34vQDJAWckeTHWSqSChRat8bgKHG39GC1fjvEm7y",
          50000000000000
        ]
      ]
    })

    await testTipData(api, 9419908, "0x7dcdfae78c1b0638fddaa4a5956acc01e03f63fef8d37f0e3c3dd036bcfb4a6e", {
      "reason": "0x78913286ac98b81eb3ee54e0cd7545156a395ed21be27ec4f150b118cc484916",
      "who": "E5qFqe5g5iS4Byu4hyKLAavayXtCiuuuK4xzuLcnQWvtqrg",
      "finder": "CsKvJ4fdesaRALc5swo5iknFDpop7YUwKPJHdmUvBsUcMGb",
      "deposit": 5733333276,
      "closes": null,
      "tips": [
        [
          "GLVeryFRbg5hEKvQZcAnLvXZEXhiYaBjzSDwrXBXrfPF7wj",
          1500000000000
        ],
        [
          "Gth5jQA6v9EFbpqSPgXcsvpGSrbTdWwmBADnqa36ptjs5m5",
          1500000000000
        ]
      ],
      "findersFee": true
    })
  });

  test("reason works", async () => {
    const height = 602672;
    await setSpecHeights([height]);
    const blockHash = await api.rpc.chain.getBlockHash(height);

    const reason = await getTipReason(
      blockHash,
      "0xed3ce0d332276bfa17c27431bac4d8bf1807cbbe114b0c5b1cbf0e7dc07ace47",
    );
    expect(reason).toEqual("https://twitter.com/ruitao_su/status/1208305894083022848");
  });
});
