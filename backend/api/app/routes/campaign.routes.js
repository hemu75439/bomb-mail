const { authJwt } = require("../middlewares");
const controller = require("../controllers/campaign.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/campaign", controller.createCampaign);
  app.patch("/api/campaign/:id", controller.updateCampaign);

  app.get("/api/campaign/list", controller.getCampaignList);
  app.get("/api/campaign/:id/status", controller.getCampaignStatus);
  app.get("/api/campaign/:id", controller.getCampaign);
};
