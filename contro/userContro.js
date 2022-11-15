const sequelize = require("../config/dataBase");
const user = require("../entity/user");
const appConst = require("../constant");
const redis = require("redis");
const { json } = require("body-parser");
require("dotenv").config();
//const { connect, use } = require("../router/router");

const redis_port = process.env.redis_port || 6379;
const host = process.env.host || "localhost";
const client = redis.createClient(redis_port, host);
client.connect();

const add = async (req, res) => {
  try {
    const resp = await user.create(req.body);
    res.status(200).json({
      status: appConst.status.success,
      response: resp,
      message: "save successfully..",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: appConst.status.fail,
      response: null,
      message: "it is not save cheak it..",
    });
  }
};
const getAll = async (req, res) => {
  try {
    let results;
    itemKeys = "user21" + "#";

    const cacheResults = await client.get(itemKeys);
    console.log(cacheResults);
    if (cacheResults) {
      console.log("from cached data");
      results = JSON.parse(cacheResults);
      console.log(results);
      res.send({
        fromCache: true,
        data: results,
      });
    } else if (!cacheResults) {
      console.log("from database ");
      const itemKeys = "user21" + "#";

      const resp = await user.findAll();
      results = resp;
      console.log(results);

      client.set(itemKeys, JSON.stringify(resp));
    }
    res.status(200).json({
      status: appConst.status.success,
      response: results,
      message: "sucssefully find..",
    });
  } catch (error) {
    res.status(400).json({
      status: appConst.status.fail,
      response: null,
      message: "sorry it is not find..",
    });
  }
};

const findById = async (req, res) => {
  try {
    let results;
    const itemKeys = "user" + req.params.id + "#";

    const cacheResults = await client.get(itemKeys);
    console.log(cacheResults);

    if (cacheResults) {
      console.log("from cache");
      results = JSON.parse(cacheResults);
      res.send({
        fromCache: true,
        data: results,
      });
    } else if (!cacheResults) {
      console.log("from db");
      const itemKeys = "user" + req.params.id + "#";
      const resp = await user.findOne({
        where: {
          id: req.params.id,
        },
      });
      console.log(resp);

      await client.set(itemKeys, JSON.stringify(resp));
      res.status(200).json({
        status: appConst.status.success,
        response: resp,
        message: "sucessfully getting..",
      });
    }

    //const resp = await user.findByPk(req.params.id);
  } catch (error) {
    res.status(400).json({
      status: appConst.status.fail,
      response: null,
      message: "not getting..",
    });
  }
};

const updateAll = async (req, res) => {
  try {
    const itemKeys = "use" + req.params.id + "#";
    const cacheUpdate = await client.get(itemKeys);
    if (cacheUpdate) {
      const resp = await JSON.parse(cacheUpdate);
      res.status(200).json({
        status: appConst.status.success,
        response: resp,
        message: "sucessfull updateing in cache..",
      });
    } else if (!cacheUpdate) {
      const resp = await user.update(req.body, {
        where: {
          id: req.params.id,
        },
      });
      console.log(resp);

      //setting updated record to cache
      client.set(itemKeys, JSON.stringify(resp));
      res.status(200).json({
        status: appConst.status.success,
        response: resp,
        message: "sucessfull updateing db..",
      });
    }
  } catch (error) {
    res.status(400).errorjson({
      status: appConst.status.fail,
      response: null,
      message: "not updateing..",
    });
  }
};

const deleteDetails = async (req, res) => {
  try {
    const deleteItemKeys = "keys#" + req.params.id + "@";

    const cachedDeleted = await client.get(deleteItemKeys);
    console.log(cachedDeleted);
    if (cachedDeleted) {
      console.log("deleted from cache ");
      const resp = client.flushAll();
      //message: "user deleted from cache also";

      res.status(200).json({
        status: appConst.status.success,
        response: resp,
        message: "data deleted from cache X",
      });
    } else if (!cachedDeleted) {
      const resp = await user.destroy({
        where: {
          id: req.params.id,
        },
      });

      client.set(deleteItemKeys, JSON.stringify(resp));
      res.status(200).json({
        status: appConst.status.success,
        response: resp,
        message: "data deleted from db X",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: appConst.status.fail,
      response: null,
      message: " data not deleted..",
    });
  }
};

module.exports = {
  add,
  getAll,
  findById,
  updateAll,
  deleteDetails,
};
