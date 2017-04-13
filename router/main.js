
module.exports = function(app, fs)
{
    // 키보드
	app.get('/keyboard', function(req, res){
        fs.readFile( __dirname + "/../data/" + "keyboard.json", 'utf8', function (err, data) {
           console.log( data );
           res.end( data );
        });
    });

    // 메시지
	app.post('/message', function(req, res){
		var result = {  };
		
		// CHECK REQ VALIDITY
        if(!req.body["user_key"] || !req.body["type"] || !req.body["content"]){
            result["success"] = 0;
            result["error"] = "invalid request";
			res.json(result);
            return;
        }

        // 초기 keyboard 버튼일 경우(도움말||시작하기||만든이)
		if(req.body["content"] == "도움말" || req.body["content"] == "시작하기" || req.body["content"] == "만든이"){
			fs.readFile( __dirname + "/../data/message.json", 'utf8',  function(err, data){
				var messages = JSON.parse(data);
				// 각 keyboard 버튼에 따른 응답 메시지 설정
				if(req.body["content"] == "도움말"){
					messages["message"] = {"text" : "얻고 싶은 이미지파일의 키워드를 검색하시면 자동으로 해당 이미지파일이 반환됩니다."};
				}else if(req.body["content"] == "시작하기"){
					messages["message"] = {"text" : "오늘 하루도 행복한 하루되세요. *^^*"};
				}else{
					messages["message"] = {"text" : "명우니닷컴(http://myeonguni.com)에서 개발하였습니다."};
				}
				fs.writeFile(__dirname + "/../data/message.json",
							 JSON.stringify(messages, null, '\t'), "utf8", function(err, data){
				})
				fs.readFile( __dirname + "/../data/message.json", 'utf8', function (err, data) {
					// 결과 로그 출력
					console.log("Request_user_key : "+req.body["user_key"]);
					console.log("Request_type : keyboard - "+req.body["content"]);
					res.end(data);
					return;
				})
			})
		}else { // 아닐 경우 이미지검색 실시
			var request = require('request'); //get방식으로 request에 대한 response를 받기위해
			var encodeURISafe = require('encodeuri-safe'); //get방식에 쓰일 파라미터 값을 인코딩하기 위해
			var param = encodeURISafe.encodeURIComponent(req.body["content"]);
			var options = {
			  url: 'https://openapi.naver.com/v1/search/image.xml?query='+param+'&start=1&display=1',
			  headers: {
				'User-Agent': 'curl/7.43.0',
				'X-Naver-Client-Id': '', //네이버 OpenAPI에서 발급받은 Client-Id 삽입
				'X-Naver-Client-Secret': '' //네이버 OpenAPI에서 발급받은 Client-Secret 삽입
			  }
			};
						
			function callback(error, response, body) {
				// 에러 체크
				if(error) return console.log('Error:', error);
				// 상태 값 체크
				if(response.statusCode !== 200)	return console.log('Invalid Status Code Returned:', response.statusCode);
				
				// 반환 값에서 이미지 url만 추출
				body = body.substring(body.indexOf("<thumbnail>")+11, body.indexOf("</thumbnail>"));
				console.log('test'+body);
				var bodyTemp = body;
				body = 	{
							"photo": {
								"url": body,
								"width": 640,
								"height": 480
							}
						};
				
				// 파일 입출력
				fs.readFile( __dirname + "/../data/messageImg.json", 'utf8',  function(err, data){
					var messages = JSON.parse(data);
					// 이미지검색 결과 저장 및 번환
					messages["message"] = body;
					fs.writeFile(__dirname + "/../data/messageImg.json",
								 JSON.stringify(messages, null, '\t'), "utf8", function(err, data){
					})
					fs.readFile( __dirname + "/../data/messageImg.json", 'utf8', function (err, data) {
						// 결과 로그 출력
						console.log("Request_user_key : "+req.body["user_key"]);
						console.log("ImgURL : "+bodyTemp);
						res.end(data);
						return;
					})
				})
			}
			
			request(options, callback);
		}
    });

}