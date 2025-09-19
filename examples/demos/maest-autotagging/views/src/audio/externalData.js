import edPath00 from "./model_sharded/0c6dbb4b-948c-11f0-8dcc-15c289af8850";
import edPath01 from "./model_sharded/0c6dbb4a-948c-11f0-8dcc-15c289af8850";
import edPath02 from "./model_sharded/0c6dbb4c-948c-11f0-8dcc-15c289af8850";
import edPath03 from "./model_sharded/0c6dbb4d-948c-11f0-8dcc-15c289af8850";
import edPath04 from "./model_sharded/0c6dbb4e-948c-11f0-8dcc-15c289af8850";
import edPath05 from "./model_sharded/0c6dbb4f-948c-11f0-8dcc-15c289af8850";
import edPath06 from "./model_sharded/0c6dbb5a-948c-11f0-8dcc-15c289af8850";
import edPath07 from "./model_sharded/0c6dbb5b-948c-11f0-8dcc-15c289af8850";
import edPath08 from "./model_sharded/0c6dbb44-948c-11f0-8dcc-15c289af8850";
import edPath09 from "./model_sharded/0c6dbb45-948c-11f0-8dcc-15c289af8850";
import edPath10 from "./model_sharded/0c6dbb46-948c-11f0-8dcc-15c289af8850";
import edPath11 from "./model_sharded/0c6dbb47-948c-11f0-8dcc-15c289af8850";
import edPath12 from "./model_sharded/0c6dbb48-948c-11f0-8dcc-15c289af8850";
import edPath13 from "./model_sharded/0c6dbb49-948c-11f0-8dcc-15c289af8850";
import edPath14 from "./model_sharded/0c6dbb50-948c-11f0-8dcc-15c289af8850";
import edPath15 from "./model_sharded/0c6dbb51-948c-11f0-8dcc-15c289af8850";
import edPath16 from "./model_sharded/0c6dbb52-948c-11f0-8dcc-15c289af8850";
import edPath17 from "./model_sharded/0c6dbb53-948c-11f0-8dcc-15c289af8850";
import edPath18 from "./model_sharded/0c6dbb54-948c-11f0-8dcc-15c289af8850";
import edPath19 from "./model_sharded/0c6dbb55-948c-11f0-8dcc-15c289af8850";
import edPath20 from "./model_sharded/0c6dbb56-948c-11f0-8dcc-15c289af8850";
import edPath21 from "./model_sharded/0c6dbb57-948c-11f0-8dcc-15c289af8850";
import edPath22 from "./model_sharded/0c6dbb58-948c-11f0-8dcc-15c289af8850";
import edPath23 from "./model_sharded/0c6dbb59-948c-11f0-8dcc-15c289af8850";

console.log('example ed path:', edPath00);

const externalDataArray = [
  edPath00,
  edPath01,
  edPath02,
  edPath03,
  edPath04,
  edPath05,
  edPath06,
  edPath07,
  edPath08,
  edPath09,
  edPath10,
  edPath11,
  edPath12,
  edPath13,
  edPath14,
  edPath15,
  edPath16,
  edPath17,
  edPath18,
  edPath19,
  edPath20,
  edPath21,
  edPath22,
  edPath23
];

function getExternalData() {
  const externalData = [];
  return new Promise(resolve => {
    externalDataArray.forEach( async (data, i) => {
      const response = await fetch(data);
      const blob = await response.arrayBuffer();
      const filename = data.split('/').at(-1);
  
      externalData.push({
        path: `./${filename}`,
        data: blob
      });
      if (i === externalDataArray.length - 1) {
        resolve(externalData);
      }
    });
  });
}


export { getExternalData };