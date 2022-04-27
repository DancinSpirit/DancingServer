
const DancingServer = {
    create: function(app, db){
        /* Home Page Loading */
        app.get("/", function(req,res){
            res.render('base',{states: ["start"],data: [{}]});
        })
        /* Page Loading */
        app.get("/*", function(req, res){
            let states = [];
            let data = [];
            let model = {};
            for(let x=1; x<req.url.split("/").length; x++){
                if(req.url.split("/")[x].includes("%7C")){
                    model.name = req.url.split("/")[x].split("%7C")[1].split("=")[0].charAt(0).toUpperCase() + req.url.split("/")[x].split("%7C")[1].split("=")[0].slice(1); 
                    model.id = req.url.split("/")[x].split("%7C")[1].split("=")[1];
                }else{
                    model = {};
                }
                data.push(model)
                states.push(req.url.split("/")[x].split("%7C")[0]);
            }
            res.render('base',{states: states, data: data});
        })
        /* Database Loading */
        app.get("/data/:model/:id", async function(req,res){
            const data = await eval(`db.${req.params.model.charAt(0).toUpperCase() + req.params.model.slice(1)}.findById('${req.params.id}')`)
            res.send(data);
        })
        /* Database Updating */
        app.post("/update/:model/:id", async function(req,res){
            let model = req.params.model.charAt(0).toUpperCase() + req.params.model.slice(1);
            let foundModel = await eval(`db.${model}.findByIdAndUpdate('${req.params.id}',${JSON.stringify(req.body)})`);
            res.send(foundModel);
        })
        /* Component Loading */
        app.post("/component/:component", async function(req,res){
            let data = {};
            let url = `components/${req.params.component.toLowerCase()}`;
            if(req.body.data){
                data = req.body.data;
            }
            if(req.body.model){
                data[req.body.model.name]  = await eval(`db.${req.body.model.name}.findById('${req.body.model.id}')`)
            }
            if(req.params.component.includes(">")){
                url = `components/${req.params.component.split(">")[0].toLowerCase()}`;
                for(let x=1; x<req.params.component.split(">").length; x++){
                    data[req.params.component.split(">")[x].split("=")[0]] = req.params.component.split(">")[x].split("=")[1];
                }
            }
            res.render(url, data);
        })
    }
}

module.exports = DancingServer;