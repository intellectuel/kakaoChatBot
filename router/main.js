

module.exports = function(app, fs) {

    app.get('/keyboard', function(req, res){
        fs.readFile( __dirname + "/../data/" + "keyboard.json", 'UTF-8', function (err, data) {
           console.log( data );
            res.set({
                'Content-Type': 'application/json;charset=UTF-8'
            }).end( data );
        });
    });



    app.post('/message', function(req, res){
    
        const _obj = {
            user_key: req.body.user_key,
            type: req.body.type,
            content: req.body.content
        };
        let massage = {
            "message": {
                "text": '응답 메세지...'
            },
            "keyboard": {
                "type": "buttons",
                "buttons": [
                    "메뉴1",
                    "메뉴2",
                    "메뉴3"
                ]
            }
        };
        res.set({
            'Content-Type': 'application/json;charset=UTF-8'
        }).send(JSON.stringify(massage));
    });


}   