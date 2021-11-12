const { isHex } = require("./index")

describe("utils", () => {
  test('isHex works', () => {
    expect(isHex('0xabc')).toBeTruthy()
  })
})
