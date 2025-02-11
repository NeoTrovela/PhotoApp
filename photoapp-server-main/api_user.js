//
// app.put('/user', async (req, res) => {...});
//
// Inserts a new user into the database, or if the
// user already exists (based on email) then the
// user's data is updated (name and bucket folder).
// Returns the user's userid in the database.
//
const photoapp_db = require('./photoapp_db.js')
const { query_database } = require('./utility.js');

exports.put_user = async (req, res) => {

  console.log("**Call to put /user...");

  try {

    let data = req.body;  // data => JS object

    //console.log(data);
    //console.log(data.lastname);

    //throw new Error("TODO: /user");

    let sql_user = `
        SELECT * FROM users WHERE email = ?;
        `;
    
    let user_promise = query_database(photoapp_db, sql_user, [data.email]);

    let user_sql_results = await Promise.all([user_promise]);
    //console.log(user_sql_results);

    if(user_sql_results[0].length > 0){ // user exists
      //console.log('reached user');
      let update_sql = `
      UPDATE users SET lastname = ?, firstname = ?, bucketfolder = ? WHERE email = ?;
      `;

      let update_promise = query_database(photoapp_db, update_sql, [data.lastname, data.firstname, data.bucketfolder, data.email]);
      let update_sql_results = await Promise.all([update_promise]);

      //if(update_sql_results.affectedRows === 1){
      res.json({
        "message": 'updated',
        "user_id": user_sql_results[0][0].userid
      });
      //}
    }
    else{ // user does not exist
      //console.log('reached insert');
      let insert_sql = `
      INSERT INTO users (email, lastname, firstname, bucketfolder) VALUES (?, ?, ?, ?);
      `;

      let insert_promise = query_database(photoapp_db, insert_sql, [data.email, data.lastname, data.firstname, data.bucketfolder]);
      let insert_sql_results = await Promise.all([insert_promise]);
      //console.log(insert_sql_results);

      if(insert_sql_results[0].affectedRows === 1){
        res.json({
          "message": 'inserted',
          "user_id": insert_sql_results[0].insertId
        });
      }
    }
	
  }//try
  catch (err) {
    console.log("**Error in /user");
    console.log(err.message);

    res.status(500).json({
      "message": err.message,
      "user_id": -1
    });
  }//catch

}//put
