const pool = require('../config/postgres');

module.exports.getLatestinfoByMac = async function(req, res){
    try{
        const c_id = req.body.macId;
        console.log(req.body.macId);
        const containerObj = await pool.query('Select * from container where c_id = $1 order by created_at desc limit 1;', [c_id]);
        const id = containerObj.rows[0].id;

        const results = await pool.query('Select * from data where c_id = $1;',[id]);
        const data = await pool.query('Select h_id from hub where id = $1;', [results.rows[0].h_id]);
        console.log('data', data.rows)
        let d = {};
        for(let i=1;i<results.rows.length;i++){
            if(i == 1){
                d.RSSI = results.rows[i].val;
            }
            else if(i == 2){
                d.quantity = results.rows[i].val;
            }
            else if(i == 3){
                d["quantityIn_percent"] = results.rows[i].val;
            }
        }
        let ans = {
            "hub" : {
                "mac_id": data.rows[0].h_id,
                "RSSI": results.rows[0].val
            },
            "container": {
                "mac_id": c_id,
                "data": d
            }
        }
        // console.log(results.rows);
        return res.status(200).json(ans);
    }
    catch(err){
        return res.status(500).send('Internal Server Error');
    }
}

module.exports.reports =async function(req, res){
    try{
        let ans = [];
        const containerObjs = await pool.query('Select distinct c_id from container;');
        containerObjs.rows = containerObjs.rows.reverse();
        // console.log(containerObjs.rows);

        let ids = [];
        for(let i=0;i<containerObjs.rows.length;i++){
            let o = "container"+i;
            let obj = {
                "container" : {
                    "conatiner_id" : containerObjs.rows[i].c_id,
                    "status" : "NIL"
                }
            };
            // console.log(obj)
            ans.push(obj);

            const id = await pool.query('Select id from container where c_id = $1 order by created_at desc limit 1;',[containerObjs.rows[i].c_id])
            ids.push(id.rows[0]);
            // console.log(id.rows);
        }
        // console.log(ans)
        // console.log(ids);
        for(let i=0;i<ids.length;i++){
            const results = await pool.query('Select * from data where c_id = $1 order by created_at desc limit 1;', [ids[i].id]);

            let d1 = results.rows[0].created_at.getTime();
            let d2 = new Date().getTime();
            // console.log(d1, d2);
            let diffInMins = Math.floor((d2 -d1)/(60*1000));
            // console.log(diffInMins);

            let o = "container"+i;
            console.log(o, ans[i])
            if(diffInMins > 3){
                ans[i]["container"]["status"] = false;
            }
            else{
                ans[i]["container"]["status"] = true;
            }
        }

        return res.status(200).json(ans);
    }
    catch(err){
        return res.status(500).send('Internal Server Error.');
    }
}

module.exports.history = async function(req, res){
    try{
        const c_id = req.body.macId;
        const from = req.body.from;
        const to = req.body.to;
        // console.log(req.body);

        const containerObjs = await pool.query('Select id from container where c_id = $1 and created_at between $2 and $3;', [c_id, from, to]);
        // console.log(containerObjs.rows);
        let ans = [];

        for(let i=0;i<containerObjs.rows.length;i++){
            const data = await pool.query('Select * from data where c_id = $1 order by created_at desc limit 3;', [containerObjs.rows[i].id])

            ans.push(data.rows.reverse());
        }

        return res.status(200).json(ans);
    }
    catch(err){
        return res.status(500).send('Internal Server Eror');
    }
}