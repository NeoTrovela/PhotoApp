//
// app.get('/images/:label', async (req, res) => {...});
//
// searched analyzed images for those containing label
//
const photoapp_db = require('./photoapp_db.js')
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { photoapp_s3, s3_bucket_name, s3_region_name } = require('./photoapp_s3.js');
const { query_database } = require('./utility.js');

exports.search_images = async (req, res) => {

    console.log("**Call to get /images/:label...");
  
    try {
      let input = {
        Bucket: s3_bucket_name
      };
  
      let sql = `
          SELECT * FROM labels WHERE labelname = ? ORDER BY assetid ASC;
          `;
  
      let sql_promise = query_database(photoapp_db, sql, [req.params.label]);
  
      let sql_results = await Promise.all([sql_promise]);
      console.log(sql_results);
  
      /*if (sql_results.length === 0 || sql_results[0].length === 0) { // no assets
        return res.json({
          "message": "No assets found...",
          "data": []
        });
      }*/

      let data = sql_results[0].map(label => ({ // makes sure we only get name and confidence vals
        "asset_id": label.assetid, // have to change this so it is asset_id not assetid
        "confidence": label.confidencelevel
      }));

    res.json({
        "message": "success",
        "data": data
    });
      
  
    }//try
    catch (err) {
      console.log("**Error in /image");
      console.log(err.message);
      
      res.status(500).json({
        "message": err.message,
        "data": []
      });
  
    }//catch
  
  }//get