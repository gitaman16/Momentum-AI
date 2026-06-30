// Central error handler so controllers can simply throw or call next(err).
export function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Internal server error"
  });
}

// 404 fallback for unmatched routes.
export function notFound(req, res) {
  res.status(404).json({ error: "Not found" });
}
