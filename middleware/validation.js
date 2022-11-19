module.exports = (schema) => {
  return async (req, res, next) => {
    try {
      const validbody = await schema.validate(req.body);
      req.body = validbody;
      next();
    } catch (err) {
      return res.status(400).json({ validationError: err.message });
    }
  };
};
