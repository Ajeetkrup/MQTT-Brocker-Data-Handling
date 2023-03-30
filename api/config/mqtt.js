const mqtt = require("mqtt");
const pool = require('./postgres');

const host = "35.197.148.203";
const port = "1883";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://${host}:${port}`;
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: "dxtxmonster",
  password: "dxtmonsterx",
  reconnectPeriod: 1000
});



// const moment = require('moment')
const topic = "/assesment/test/data/sens/";
client.on("connect", () => {
  console.log("Connected to broker successfully.");
  client.subscribe([topic], () => {
    console.log(`Subscribed to topic '${topic}'`);
  });
});

// console.log(client.connected);


client.on("message", async (topic, payload) => {
    console.log("Received Message:", topic, payload.toString());
    var data = payload.toString();
    data = JSON.parse(data);

    let datetime = data.hub.timestamp.toString();
    datetime = datetime.split(",");
    
    let newD = datetime[0]
    let c = newD.split("/");
    let d = "20"+c[2] + "-" + c[0] + "-" + c[1];

    // console.log(datetime);
    let query = "Insert into hub(h_id, time) values ('" + data.hub.id + "','" + d + " " + datetime[1] +"');";
    // console.log(query);

    try{
        await pool.query(query);
        let status = false;
        if(data.node.data[1].val > 0){
            status = true;
        }
        await pool.query("Insert into container(c_id, status) values ($1, $2);", [data.node.id, status]);
        // console.log(data.hub.data[0].s_id)
        const hubObj = await pool.query("Select * from hub order by created_at desc limit 1;");
        const containerObj = await pool.query("Select * from container order by created_at desc limit 1;");
        const h_id = hubObj.rows[0].id, c_id = containerObj.rows[0].id;

        for(let i=0;i<data.hub.data.length;i++){
            try{      
                await pool.query("Insert into data(s_id, val, h_id, c_id) values ($1,$2,$3,$4);",[data.hub.data[i].s_id, data.hub.data[i].val, h_id, c_id]);
            }
            catch(err){
                console.log('Error while insertion data for hub : ', err);
            }
        }

        for(let i=0;i<data.node.data.length;i++){
            try{      
                await pool.query("Insert into data(s_id, val, h_id, c_id) values ($1,$2,$3,$4);",[data.node.data[i].s_id, data.node.data[i].val, h_id, c_id]);
            }
            catch(err){
                console.log('Error while insertion data for container : ', err);
            }
        }
    }
    catch(err){
        console.log('Error while insertion : ', err);
    }
});

module.exports = client;