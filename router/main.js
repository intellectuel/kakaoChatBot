

module.exports = function(app, fs)
{


    app.get('/keyboard', function(req, res){
       const menu = {
            type: 'buttons',
            buttons: ["메뉴1", "메뉴2", "메뉴3"]
        };

        res.set({
            'Content-Type': 'application/json'
        }).send(JSON.stringify(menu));
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
            'Content-Type': 'application/json'
        }).send(JSON.stringify(massage));
    });


}   