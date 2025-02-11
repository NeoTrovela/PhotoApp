//
// photoapp_rekognition.js
//
// Exports 
// photoapp_rekognition: an AWS Rekognition object
//

const { RekognitionClient } = require('@aws-sdk/client-rekognition');
const { fromIni } = require('@aws-sdk/credential-providers');

const fs = require('fs');
const ini = require('ini');

const config = require('./config.js');

const photoapp_config = ini.parse(fs.readFileSync(config.photoapp_config, 'utf-8'));
const s3_region_name = photoapp_config.s3.region_name;

//
// create Rekognition object for communicating with Rekognition AI service:
//
let photoapp_rekognition = new RekognitionClient({
  region: s3_region_name,
  credentials: fromIni({ profile: config.photoapp_profile })
});

module.exports = photoapp_rekognition;
