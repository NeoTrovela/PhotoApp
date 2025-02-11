//
// app.post('/image/:userid', async (req, res) => {...});
//
// Uploads an image to the bucket and updates the database,
// returning the asset id assigned to this image.
//
const photoapp_db = require('./photoapp_db.js')
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { photoapp_s3, s3_bucket_name, s3_region_name } = require('./photoapp_s3.js');
const { query_database } = require('./utility.js');

const uuid = require('uuid');

exports.post_image = async (req, res) => {

  console.log("**Call to post /image/:userid...");

  try {

    let data = req.body;  // data => JS object
    //console.log(data);

    let user_id = req.params.userid;

    let sql = `
        SELECT * FROM users WHERE userid = ?;
        `;

    let sql_promise = query_database(photoapp_db, sql, [user_id]);
    let sql_result = await Promise.all([sql_promise]);

    //console.log(sql_result);

    if(sql_result[0].length === 0){ // invalid user id
      return res.status(400).json({
        "message": "No such user...",
        "asset_id": -1
      });
    }

    console.log(sql_result);

    // generate a unique name for the asset:
    let name = uuid.v4() + '.jpg';
    console.log(name);

    let new_bucketkey = sql_result[0][0].bucketfolder + '/' + name;
    console.log(new_bucketkey);

    let S = req.body.data;
    let bytes = Buffer.from(S, 'base64');

    // setting our params for input
    let input = {
      Bucket: s3_bucket_name
    };
    input.ContentType = "image/jpg";
    input.ACL = "public-read";
    input.Key = new_bucketkey;
    input.Body = bytes;

    let command = new PutObjectCommand(input);
    let promise = photoapp_s3.send(command);

    let s3_result = await Promise.all([promise]); // upload to S3
    console.log(s3_result);

    let insert_sql = `
    INSERT INTO assets (userid, assetname, bucketkey) VALUES (?, ?, ?)
    `;
    console.log(name);
    let insert_promise = await query_database(photoapp_db, insert_sql, [user_id, data.assetname, new_bucketkey]);
    //let insert_sql_results = await Promise.all([insert_promise]);

    //console.log(insert_sql_results);
    //console.log(insert_promise);

    if (insert_promise.affectedRows === 1) {
      res.json({
        "message": "success",
        "asset_id": insert_promise.insertId
      });
    }
    else{
      res.status(500).json({
        "message": "some sort of error message",
        "asset_id": -1
      });
    }

    //throw new Error("TODO: /image");
    
    /*res.json({
      "message":'no such',
      "asset_id": -1
    });*/
	
  }//try
  catch (err) {
    console.log("**Error in /image");
    console.log(err.message);
    
    res.status(500).json({
      "message": err.message,
      "asset_id": -1
    });
  }//catch

}//post
