import { TypeRegistry } from "@polkadot/types/create";
import {
  formatNumber,
  isCodec,
  stringToU8a,
  u8aEmpty,
  u8aEq,
  u8aToBn,
} from "@polkadot/util";

const registry = new TypeRegistry();

function createAllMatcher(prefix, name) {
  const test = registry.createType(
    "AccountId",
    stringToU8a(prefix.padEnd(32, "\0")),
  );

  return (addr) => (test.eq(addr) ? name : null);
}

function createNumMatcher(prefix, name, add) {
  const test = stringToU8a(prefix);

  // 4 bytes for u32 (more should not hurt, LE)
  const minLength = test.length + 4;

  return (addr) => {
    try {
      const u8a = isCodec(addr)
        ? addr.toU8a()
        : registry.createType("AccountId", addr).toU8a();

      return u8a.length >= minLength &&
        u8aEq(test, u8a.subarray(0, test.length)) &&
        u8aEmpty(u8a.subarray(minLength))
        ? `${name} ${formatNumber(
            u8aToBn(u8a.subarray(test.length, minLength)),
          )}${add ? ` (${add})` : ""}`
        : null;
    } catch (e) {
      return null;
    }
  };
}

export const KNOWN_ADDR_MATCHERS = [
  createAllMatcher("modlpy/socie", "Society"),
  createAllMatcher("modlpy/trsry", "Treasury"),
  createAllMatcher("modlpy/xcmch", "XCM"),
  createNumMatcher("modlpy/cfund", "Crowdloan"),
  // Substrate master
  createNumMatcher("modlpy/npols\x00", "Pool", "Stash"),
  createNumMatcher("modlpy/npols\x01", "Pool", "Reward"),
  // Westend
  createNumMatcher("modlpy/nopls\x00", "Pool", "Stash"),
  createNumMatcher("modlpy/nopls\x01", "Pool", "Reward"),
  createNumMatcher("para", "Parachain"),
  createNumMatcher("sibl", "Sibling"),
];
