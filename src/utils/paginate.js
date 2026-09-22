const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const toPositiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const paginate = (page, limit) => {
  const normalizedPage = toPositiveInteger(page, 1);
  const normalizedLimit = Math.min(
    toPositiveInteger(limit, DEFAULT_LIMIT),
    MAX_LIMIT,
  );

  return {
    page: normalizedPage,
    limit: normalizedLimit,
    offset: (normalizedPage - 1) * normalizedLimit,
  };
};

module.exports = paginate;
