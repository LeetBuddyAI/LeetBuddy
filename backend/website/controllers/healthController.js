class HealthController {
  async healthCheck(req, res) {
    try {
      res.status(200).send("OK");
    } catch (error) {
      res.status(503).send("Service Unavailable");
    }
  }
}

module.exports = HealthController;
