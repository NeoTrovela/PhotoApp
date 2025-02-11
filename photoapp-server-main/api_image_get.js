//
// app.get('/image/:assetid', async (req, res) => {...});
//
// downloads an asset from S3 bucket and sends it back to the
// client as a base64-encoded string.
//
const photoapp_db = require('./photoapp_db.js')
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { photoapp_s3, s3_bucket_name, s3_region_name } = require('./photoapp_s3.js');
const { query_database } = require('./utility.js');

exports.get_image = async (req, res) => {

  console.log("**Call to get /image/:assetid...");

  try {

    
    //throw new Error("TODO: /image/:assetid");

    //
    // TODO
    //
    // MySQL in JS:
    //   https://expressjs.com/en/guide/database-integration.html#mysql
    //   https://github.com/mysqljs/mysql
    // AWS:
    //   https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html
    //   https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/getobjectcommand.html
    //   https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/
    //
    
    /*{ message: “...”, user_id: ..., asset_name: “...”,
      bucket_key: “...”
      ,
    data: “...” }*/ // from assignment
    // build input object for S3 with request parameters:
    let input = {
      Bucket: s3_bucket_name
    };

    let sql = `
        SELECT * FROM assets WHERE assetid = ?;
        `;

    let sql_promise = query_database(photoapp_db, sql, [req.params.assetid]);

    let sql_results = await Promise.all([sql_promise]);
    //console.log(sql_results);

    if (sql_results.length === 0 || sql_results[0].length === 0) { // invalid asset id
      return res.status(400).json({
        "message": "No such asset...",
        "user_id": -1,
        "asset_name": "?",
        "bucket_key": "?",
        "data": []
      });
    }

    input.Key = sql_results[0][0].bucketkey;
    //console.log(sql_results[0][0]);

    let command = new GetObjectCommand(input);
    let s3_promise = photoapp_s3.send(command);

    let s3_result = await Promise.all([s3_promise]);
    //console.log(s3_result);
    var datastr = await s3_result[0].Body.transformToString("base64");

    res.json({
      "message": "success",
      "user_id": sql_results[0][0].userid,
      "asset_name": sql_results[0][0].assetname,
      "bucket_key": sql_results[0][0].bucketkey,
      "data": datastr
    });

  }//try
  catch (err) {
    console.log("**Error in /image");
    console.log(err.message);
    
    res.status(500).json({
      "message": err.message,
      "user_id": -1,
      "asset_name": "?",
      "bucket_key": "?",
      "data": []
    });

  }//catch

}//get