const pool = require('../config/postgres');

module.exports.getLatestinfoByMac = async function(req, res){
    try{
        const c_id = req.body.macId;
        console.log(req.body.macId);
        const containerObj = await pool.query('Select * from container where c_id = $1 order by created_at desc limit 1;', [c_id]);
        const id = containerObj.rows[0].id;

        const results = await pool.query('Select * from data where c_id = $1 order by created_at desc limit 3;',[id]);

        // console.log(results.rows);
        return res.status(200).json(results.rows.reverse());
    }
    catch(err){
        return res.status(500).send('Internal Server Error');
    }
}

module.exports.reports =function(req, res){

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