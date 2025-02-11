//
// app.get('/labels/:assetid', async (req, res) => {...});
//
// analyze image to label objects
//

const photoapp_db = require('./photoapp_db.js')
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { photoapp_s3, s3_bucket_name, s3_region_name } = require('./photoapp_s3.js');
const { query_database } = require('./utility.js');
const {DetectLabelsCommand} = require("@aws-sdk/client-rekognition");
const photoapp_rekognition = require('./photoapp_rekognition.js');

exports.analyze_image = async (req, res) => {

  console.log("**Call to get /labels/:assetid...");

  try{
    /*let input = {
      Bucket: s3_bucket_name
    };*/
      
    let sql1 = `
        SELECT * FROM assets WHERE assetid = ?;
        `;
    
    let sql_promise1 = query_database(photoapp_db, sql1, [req.params.assetid]);
    
    let sql_results1 = await Promise.all([sql_promise1]);
    //console.log(sql_results);
    
    if (sql_results1.length === 0 || sql_results1[0].length === 0) { // invalid asset id
      return res.status(400).json({
        "message": "No such asset...",
        "asset_name": "?",
        "data": []
      });
    }

    let asset_name = sql_results1[0][0].assetname;
    let bucketkey = sql_results1[0][0].bucketkey;

    let sql2 = `
        SELECT labelname, confidencelevel FROM labels WHERE assetid = ? ORDER BY labelname ASC;
        `;
    let sql_promise2 = query_database(photoapp_db, sql2, [req.params.assetid]);

    let sql_results2 = await Promise.all([sql_promise2]);
    //console.log(sql_results2);
    let data = sql_results2[0].map(label => ({ // makes sure we only get name and confidence vals
      "name": label.labelname, // have to change this so it is asset_id not assetid
      "confidence": label.confidencelevel
    }));

    if (sql_results2[0].length > 0) { // labels already exist
      return res.json({
          "message": "success",
          "asset_name": asset_name,
          "data": data
      });
    }

    const input = {
      Image: {
        S3Object: {
          Bucket: s3_bucket_name,
          Name: bucketkey,
        },
      },
      MaxLabels: 100,
      MinConfidence: 80.0,
    };

    const command = new DetectLabelsCommand(input);
    let rek_promise = photoapp_rekognition.send(command)

    let rek_result = await Promise.all([rek_promise]);
    //console.log(rek_result);
    //console.log(rek_result[0].Labels);

    let labels = rek_result[0].Labels.map(label => ({ // makes sure we only get name and confidence vals
      name: label.Name,
      confidence: Math.floor(label.Confidence)
    }));

    if (labels.length === 0) { // incase rek gave us empty labels list
      return res.json({
        "message": "success",
        "asset_name": asset_name,
        "data": []
      });
    }

    let values = labels.map(label => [req.params.assetid, label.name, label.confidence]);
    let insert_sql = `INSERT INTO labels (assetid, labelname, confidencelevel) VALUES ${values.map(() => "(?, ?, ?)").join(", ")}`; // adds new analyzed labels + CL to labels database
    //let values = labels.map(label => [req.params.assetid, label.name, label.confidence]); // gets name and confidence for each label
    let flattenedValues = values.flat();
    let insert_promise = query_database(photoapp_db, insert_sql, flattenedValues);

    let insert_results = await Promise.all([insert_promise]);

    //console.log(rek_result);
    //console.log(labels);

    /*res.json({
      "message": 'success',
      "asset_name": asset_name,
      "data": rek_result[0].Labels
    });*/

    res.json({
      "message": 'success',
      "asset_name": asset_name,
      "data": labels
    })

  }//try
  catch (err) {
    console.log("**Error in /image");
    console.log(err.message);
      
    res.status(500).json({
      "message": err.message,
      "asset_name": "?",
      "data": []
    });
    
  }//catch
}