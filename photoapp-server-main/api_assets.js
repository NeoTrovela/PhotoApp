//
// app.get('/assets', async (req, res) => {...});
//
// Return all the assets from the database:
//
const photoapp_db = require('./photoapp_db.js')
const { query_database } = require('./utility.js');

exports.get_assets = async (req, res) => {

  console.log("**Call to get /assets...");

  try {
    //throw new Error("TODO: /users");

    //
    // MySQL in JS:
    //   https://expressjs.com/en/guide/database-integration.html#mysql
    //   https://github.com/mysqljs/mysql
    //
    let sql = `
    SELECT * FROM assets ORDER BY assetid;
    `
    let sql_assets = query_database(photoapp_db, sql);
    //console.log(sql_assets);

    let results = await Promise.all([sql_assets]);
    //console.log(results);
    // results -> array of array of objects
    // use results[0] to access our list of objects

    //console.log(results[0]);
    let asset_info = results[0]
    //console.log(asset_info);

    //console.log(result);
    res.json({
      "message": 'success',
      "data": asset_info
    });
    

  }//try
  catch (err) {
    console.log("**Error in /assets");
    console.log(err.message);
    
    res.status(500).json({
      "message": err.message,
      "data": []
    });
  }//catch

}//get
