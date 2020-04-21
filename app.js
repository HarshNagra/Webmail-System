var express = require('express');
var app = express();

var monk = require('monk');
var db = monk('localhost:27017/assignment1');


app.use(express.static('public'), function(req,res,next){	
  req.db = db;
  next();
})

app.get('/webmail.html', function (req, res) {
  res.sendFile(__dirname + "/public/" + "webmail.html");
})

//global VARIABLES
globalShow="Inbox";
globalSave=0;
emailsPerPage=3;


function ResHTML(docs) {
  var response_string = "<table>";
  if(globalShow=="Sent"){
    response_string += "<th>Select</th><th>Recipient</th><th>Title</th><th>Time</th>";
  }
  else{
    response_string += "<th>Select</th><th>Sender</th><th>Title</th><th>Time</th>";
  }
  var until=docs.length;
  var start=0;

  

  start=(globalSave*emailsPerPage);
  until=(parseInt(globalSave)+parseInt(1))*emailsPerPage;

  if(docs.length<until){
    until=docs.length;
  
  }


	for (var i = start; i < until; i++) {
    var email = docs[i];

    response_string += "<tr>";
    response_string += "<td><input type=\"checkbox\" id="+email['_id']+"></td>";
    if(globalShow=="Sent"){
      response_string += "<td><span id="+email['_id']+" onclick=\"openCurrentEmail(this.id)\">" + email['recipient'] + "</span></td><td><span id="+email['_id']+" onclick=\"openCurrentEmail(this.id)\">" + email['title'] + "</span></td>";
    }
    else{
      response_string += "<td><span id="+email['_id']+" onclick=\"openCurrentEmail(this.id)\">" + email['sender'] + "</span></td><td><span id="+email['_id']+" onclick=\"openCurrentEmail(this.id)\">" + email['title'] + "</span></td>";
    }
    response_string += "<td><span id="+email['_id']+" onclick=\"openCurrentEmail(this.id)\">(" + email['time'] + ")</span></td>";
    response_string += "</tr>"
  }
  response_string+="</table>"
	return response_string;
}



function ShowCurrentHTML(docs){
  var response_string = "";
  var email = docs[0];

  response_string+= "<div>";
  response_string+= "<h4>Title- <br/>"+email["title"]+"</h4>";
  response_string+= "<h4 id=\"time\">"+email["time"]+"</h4>";
  response_string+= "</div>";
  response_string+= "<h4>Sender- <br/>"+email["sender"]+"</h4>";
  response_string+= "<br/>";
  response_string+= "<h4>Recipient- <br/>"+email["recipient"]+"</h4>";
  response_string+= "<br/>";
  response_string+= "<p>Content- <br/>"+email["content"]+"<p>";
  return response_string;
}

app.get('/', function(req, res){
  var db = req.db;
  var collection = db.get('emailList');
  globalSave=0;

  emailsPerPage=req.query.emailsPerPage;
	
  collection.find({"mailbox":"Inbox"}, {time:-1}, function(err, docs){
    if (err === null){
      res.send(ResHTML(docs));
    } else res.send(err);
  })
})


app.get('/retrieveemaillist', function(req, res){
  var db = req.db;
  var collection = db.get('emailList');

  globalSave=0;

  globalShow=req.query.show;

  // collection.find().sort( { time: -1 } );
  
  collection.find({"mailbox":globalShow}, {time:-1}, function(err, docs){
    if (err === null && docs.length>0){
        res.send(ResHTML(docs));
    } else res.send(err);
  })
})

function displayComposeLayoput(){
  var response_string="";

  response_string+="<form id=\"composeForm\" action=\"sendemail\" method=\"post\" onsubmit=\"sendEmail()\">";

  response_string+="To:<br>";
  response_string+="<input class=\"textarea\" type=\"text\" name=\"RecipientCompose\" value=\"\" id=\"RecipientCompose\" ></input> <br>";
  response_string+="From:<br>";
  response_string+="<input readonly class=\"textarea\" type=\"text\" name=\"SenderCompose\" value=\"john@cs.hku.hk\" id=\"SenderCompose\" ></input> <br>";
  response_string+="Title:<br>";
  response_string+="<input class=\"textarea\" type=\"text\" name=\"TitleCompose\" value=\"\" id=\"TitleCompose\" ></input><br>";
  response_string+="Content:<br>";
  response_string+="<input class=\"textareacontent\" type=\"text\" name=\"ContentCompose\" value=\"\" id=\"ContentCompose\" ></input><br>";

  response_string+="<input type=\"submit\"  value=\"Send\" class=\"dropbtn\">";
  response_string+="</form>";
  return response_string;
}

app.get('/ComposeDisplay', function(req, res){
  
  res.send(displayComposeLayoput());
})

app.post('/sendemail', express.urlencoded({ extended: true }), function (req, res) {
	var db = req.db;
  var collection = db.get('emailList');

	collection.insert({sender: req.body.sender, recipient: req.body.recipient, title: req.body.title, time: req.body.timesend, content: req.body.content, mailbox:"Sent"});
  if (err === null){
    res.send(ResHTML(docs));
  } else res.send(err);
})


app.get('/getemail', function(req, res){
  var db = req.db;
  var collection = db.get('emailList');

  var id=req.query.show;
  collection.find().sort({time:-1});
  collection.find({"_id":id}, {time:-1}, function(err, docs){
    if (err === null){
      res.send(ShowCurrentHTML(docs));
    } else res.send(err);
  })
})

app.get('/Next', function(req, res){
  var db = req.db;
  var collection = db.get('emailList');
  // globalSave=req.query.show;


  globalSave+=1;


  collection.find({"mailbox":globalShow}, {time:-1}, function(err, docs){
      if (err === null && docs.length>0){
        res.send(ResHTML(docs));
      } else res.send(err);
    })

})

app.get('/Previous', function(req, res){
  var db = req.db;
  var collection = db.get('emailList');
  // globalSave=req.query.show;

  if(globalSave-1>=0){
  globalSave-=1;
  }
  collection.find({"mailbox":globalShow}, {time:-1}, function(err, docs){
    if (err === null && docs.length>0){
      res.send(ResHTML(docs));
    } else res.send(err);
  })
  
 
})

app.get('/GetSelected', function(req, res){
	
	var show = req.query.show;
	
	if(show == "Inbox"){
		res.send(
      "<a id=\"Important\" onclick=\"moveEmail(this.id)\" >Important</a> <a id=\"Sent\" onclick=\"moveEmail(this.id)\">Sent</a> <a id=\"Trash\" onclick=\"moveEmail(this.id)\">Trash</a>"
    )
  } else if(show == "Important"){
    res.send(
      "<a id=\"Inbox\" onclick=\"moveEmail(this.id)\" >Inbox</a> <a id=\"Sent\" onclick=\"moveEmail(this.id)\">Sent</a> <a id=\"Trash\" onclick=\"moveEmail(this.id)\">Trash</a>"
    )
  } else if(show == "Sent"){
    res.send(
      "<a id=\"Inbox\" onclick=\"moveEmail(this.id)\" >Inbox</a> <a id=\"Important\" onclick=\"moveEmail(this.id)\">Important</a> <a id=\"Trash\" onclick=\"moveEmail(this.id)\">Trash</a>"
    )
  }else if( show == "Trash"){
    res.send(
      "<a id=\"Inbox\" onclick=\"moveEmail(this.id)\" >Inbox</a> <a id=\"Important\" onclick=\"moveEmail(this.id)\">Important</a> <a id=\"Sent\" onclick=\"moveEmail(this.id)\">Sent</a>"
    )
  }
})

app.get('/GetColor', function(req, res){
	
	var show = req.query.show;
	
	if(show == "Inbox"){
		res.send(
      "<li><a id=\"Inbox\"  class=\"btn active\" onclick=\"selectedNav(this.id)\">Inbox</a></li> <li><a id=\"Important\"  class=\"btn\" onclick=\"selectedNav(this.id)\">Important</a></li> <li><a id=\"Sent\"  class=\"btn\" onclick=\"selectedNav(this.id)\">Sent</a></li> <li><a id=\"Trash\"  class=\"btn\" onclick=\"selectedNav(this.id)\">Trash</a></li>"
    )
  } else if(show == "Important"){
    res.send(
      "<li><a id=\"Inbox\"  class=\"btn\" onclick=\"selectedNav(this.id)\">Inbox</a></li> <li><a id=\"Important\"  class=\"btn active\" onclick=\"selectedNav(this.id)\">Important</a></li> <li><a id=\"Sent\"  class=\"btn\" onclick=\"selectedNav(this.id)\">Sent</a></li> <li><a id=\"Trash\"  class=\"btn\" onclick=\"selectedNav(this.id)\">Trash</a></li>"
    )
  } else if(show == "Sent"){
    res.send(
      "<li><a id=\"Inbox\"  class=\"btn\" onclick=\"selectedNav(this.id)\">Inbox</a></li> <li><a id=\"Important\"  class=\"btn\" onclick=\"selectedNav(this.id)\">Important</a></li> <li><a id=\"Sent\"  class=\"btn active\" onclick=\"selectedNav(this.id)\">Sent</a></li> <li><a id=\"Trash\"  class=\"btn\" onclick=\"selectedNav(this.id)\">Trash</a></li>"
    )
  }else if( show == "Trash"){
    res.send(
      "<li><a id=\"Inbox\"  class=\"btn\" onclick=\"selectedNav(this.id)\">Inbox</a></li> <li><a id=\"Important\"  class=\"btn\" onclick=\"selectedNav(this.id)\">Important</a></li> <li><a id=\"Sent\" class=\"btn\" onclick=\"selectedNav(this.id)\">Sent</a></li> <li><a id=\"Trash\"  class=\"btn active\" onclick=\"selectedNav(this.id)\">Trash</a></li>"
    )
  }
})

app.post('/changeemailbox', express.urlencoded({ extended: true }), function(req, res){
	var db = req.db;
	var collection = db.get('emailList');
	
	var id = req.body.id;
	var newValue = req.body.newValue;
	
	collection.update({"_id":id}, {$set:{'mailbox':newValue}}, function(err, docs){
  })

  collection.find({"mailbox":globalShow}, {time:-1}, function(err, docs){
    if (err === null && docs.length>0){
        res.send(ResHTML(docs));
    } else res.send(err);
  })
  
})



var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
})
