function extractPage(ctx) {
  const { page_size: queryPageSize, page: queryPage } = ctx.query;

  let pageSize;
  try {
    pageSize = parseInt(queryPageSize);
    pageSize = isNaN(pageSize) ? 10 : pageSize;
  } catch (e) {
    pageSize = 10;
  }

  let page;
  try {
    page = parseInt(queryPage);
    page = isNaN(page) ? 0 : page;
  } catch (e) {
    page = 0;
  }

  return {
    page,
    pageSize,
  };
}

module.exports = {
  extractPage,
};
