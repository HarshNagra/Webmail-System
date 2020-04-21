pageCount=0;




function openCurrentEmail(id) {
    var xmlhttp = new XMLHttpRequest();
    
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var displayMoveTo = document.getElementById("emailDisplay");
            displayMoveTo.innerHTML = xmlhttp.responseText;
        }
    }
    xmlhttp.open("GET", "/getemail?show="+id ,true);
    xmlhttp.send();
}

function moveToOpen() {
    document.getElementById("myDropdown").classList.toggle("show");
}   

function onloadFunction() {

    var emailsPerPage = prompt("Please enter number of emails per page", "3");
    
    var xmlhttp = new XMLHttpRequest();
    
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var displayMoveTo = document.getElementById("emailDisplay");
            displayMoveTo.innerHTML = xmlhttp.responseText;
        }
    }
    xmlhttp.open("GET", "/?emailsPerPage="+emailsPerPage ,true);
    xmlhttp.send();
}

function next(){
    var xmlhttp = new XMLHttpRequest();
    
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var displayMoveTo = document.getElementById("emailDisplay");
            displayMoveTo.innerHTML = xmlhttp.responseText;
        }
    }

    // if (pageCount+1<=2){
    //     pageCount+=1;
    // }
    
    xmlhttp.open("GET", "/Next",true);
    xmlhttp.send();
}

function previous(){
    var xmlhttp = new XMLHttpRequest();
    
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var displayMoveTo = document.getElementById("emailDisplay");
            displayMoveTo.innerHTML = xmlhttp.responseText;
        }
    }
    
    // if (pageCount-1>=0){
    //     pageCount-=1;
    // }
    xmlhttp.open("GET", "/Previous" ,true);
    xmlhttp.send();
}

function selectedNav(id){

    var xmlhttp = new XMLHttpRequest();

    
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var displayMoveTo = document.getElementById("myDropdown");
            displayMoveTo.innerHTML = xmlhttp.responseText;
        }
    }
    
    xmlhttp.open("GET", "GetSelected?show="+id,true);
    xmlhttp.send();
    
    var xmlhttp2 = new XMLHttpRequest();
    
    xmlhttp2.onreadystatechange = function () {
        if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200) {
            var displayMoveTo = document.getElementById("mainNavDiv");
            displayMoveTo.innerHTML = xmlhttp2.responseText;
        }
    }
    
    xmlhttp2.open("GET", "GetColor?show="+id,true);
    xmlhttp2.send();

    var xmlhttp3 = new XMLHttpRequest();
    
    xmlhttp3.onreadystatechange = function () {
        if (xmlhttp3.readyState == 4 && xmlhttp3.status == 200) {
            var displayMoveTo = document.getElementById("emailDisplay");
            displayMoveTo.innerHTML = xmlhttp3.responseText;
        }
    }
    
    xmlhttp3.open("GET", "retrieveemaillist?show="+id,true);
    xmlhttp3.send();
}

function compose(){

    // document.getelementbyId("myDropdown").disable = true
    
    var xmlhttp0 = new XMLHttpRequest();

    xmlhttp0.onreadystatechange = function () {
    if (xmlhttp0.readyState == 4 && xmlhttp0.status == 200) {
            var displayMoveTo = document.getElementById("emailDisplay");
            displayMoveTo.innerHTML = xmlhttp0.responseText;
        }
    }
    xmlhttp0.open("GET", "ComposeDisplay" ,true);
    xmlhttp0.send();


}

function sendEmail(){

    event.preventDefault();

    if(document.getElementById("RecipientCompose").value.length>0){

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var displayMoveTo = document.getElementById("emailDisplay");
            displayMoveTo.innerHTML = xmlhttp.responseText;
        }
    }

    var f = document.getElementById("composeForm");
    var method = f.getAttribute("method");
    var url = f.getAttribute("action");
    var recipientN = document.getElementById("RecipientCompose").value;
    var senderN = document.getElementById("SenderCompose").value;
    var titleN = document.getElementById("TitleCompose").value;
    var contentN = document.getElementById("ContentCompose").value;

    d = new Date();
    datetext = d.toDateString();

    timetext = d.toTimeString();
    timetext = timetext.split(" ");
    
    totalTime = timetext[0]+" "+datetext;


    xmlhttp.open(method, url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("recipient="+recipientN+"&sender="+senderN+"&title="+titleN+"&content="+contentN+"&timesend="+totalTime);

    document.getElementById("emailDisplay").innerHTML="Sent";

}


}

function moveEmail(newBox){
    var array = [];
    var checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
    for (var i = 0; i < checkboxes.length; i++) {
      array.push(checkboxes[i].id);
    }

    for (var i = 0; i < array.length; i++) {

        var xmlhttp = new XMLHttpRequest();
    
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var displayMoveTo = document.getElementById("emailDisplay");
                displayMoveTo.innerHTML = xmlhttp.responseText;
            }
        }
        
        xmlhttp.open("POST", "changeemailbox", true);
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xmlhttp.send("newValue="+newBox+"&id="+checkboxes[i].id);
       
    }

    var checkboxesB = document.querySelectorAll('input[type=checkbox]:checked'); 

    for(k=0;k< checkboxesB.length;k++){
        chk_arr[k].checked = false;
    }

}