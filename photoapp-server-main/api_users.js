//
// app.get('/users', async (req, res) => {...});
//
// Return all the users from the database:
//
const photoapp_db = require('./photoapp_db.js')
const { query_database } = require('./utility.js');

exports.get_users = async (req, res) => {

  console.log("**Call to get /users...");

  try {
    //throw new Error("TODO: /users");

    //
    // MySQL in JS:
    //   https://expressjs.com/en/guide/database-integration.html#mysql
    //   https://github.com/mysqljs/mysql
    //
    let sql = `
    SELECT * FROM users ORDER BY userid;
    `
    let sql_users = query_database(photoapp_db, sql);
    //console.log(sql_users);

    let results = await Promise.all([sql_users]);
    // results -> array of array of objects
    // use results[0] to access our list of objects

    //console.log(results[0]);
    let user_info = results[0]
    //console.log(user_info);

    //console.log(result);
    res.json({
      "message": 'success',
      "data": user_info
    });
      
  }//try
  catch (err) {
    console.log("**Error in /users");
    console.log(err.message);
    
    res.status(500).json({
      "message": err.message,
      "data": []
    });
  }//catch

}//get
