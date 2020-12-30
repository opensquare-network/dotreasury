module.exports = function extractBlockTime(extrinsics) {
  const setTimeExtrinsic = extrinsics.find(
    ex =>
      ex.method.sectionName === 'timestamp' && ex.method.methodName === 'set'
  )
  if (setTimeExtrinsic) {
    const { args } = setTimeExtrinsic.method.toJSON()
    return args.now
  }
}
