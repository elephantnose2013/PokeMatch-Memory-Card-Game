var socket = io();

var poke=[1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10];
var number=Math.ceil(Math.random()*10);
poke.splice((number-1)*2,2);
var flag=false;
var oneid=-1;
var count=0;

var remote_id;
var remote_oneid;



var pathname = window.location.pathname; // Returns path only (/path/example.html)
socket.emit('gametest',{path:pathname});


function poker(id){
    if(poke[id]==-1||oneid==id){
        return;
    }
    count++;
    document.getElementById("location"+id).src="images/eevee/card"+poke[id]+".jpg";
    socket.emit('up', {remote_id:id});
    if(flag){
        if(poke[id]==poke[oneid]){
            poke[id]=-1;
            poke[oneid]=-1;
        }
        else{
            setTimeout("fail("+id+","+oneid+")",600);
        }
        oneid=-1;
        flag=false;
    }
    else{
        oneid=id;
        flag=true;
    }
    check_success();
}
function shuffle_poke(){
    for(var i=0;i<18;i++){
        document.getElementById("location"+i).src="images/cardbg.png";
    }
    for(var i=0;i<18;i++){
        var a=Math.floor(Math.random()*18);
        var b=Math.floor(Math.random()*18);
        var temp=poke[a];
        poke[a]=poke[b];
        poke[b]=temp;
    }    
}
function fail(id, oneid){
    document.getElementById("location"+id).src="images/cardbg.png";
    document.getElementById("location"+oneid).src="images/cardbg.png";
    socket.emit('back', {remote_id:id,remote_oneid:oneid});
}
function check_success(){
    for(var i=0;i<18;i++){
        if(poke[i]!=-1)
            return;
    }
    $("#box").show();
    $("#hidesteps").hide(); 
    document.getElementById("result").innerHTML="You win!";
    document.getElementById("steps").innerHTML=count;
    socket.emit('lose');
}

function upload(){
    $.ajax({
        type:"post",
        url:"/ranking2",
        success:function(data){
            if(data.status==-1){
                alert("Upload Fail!");
            }else{
            alert("Upload success!");
            }
        },
        error:function(){
            alert("Internet Error");
        }
    })
};

socket.on('waiting', function(str) {
    document.getElementById('waiting').innerHTML = str;
})

socket.on('ready', function(str) {
    socket.emit("getname",{remotename:user});
    document.getElementById('ready').innerHTML = str;
    $("#togoshow").show();
    var i = 3;      
    var intervalid; 
    function fun() { 
        if (i == 0) { 
            $("#startpage").hide();
            clearInterval(intervalid); 
        }    
        document.getElementById("mes").innerHTML = i; 
        i--; 
    } 
    intervalid = setInterval(fun, 1000);   
})
var remote_poke;
socket.on('start', function() {
    socket.yet = true;
    shuffle_poke();
    socket.emit('init', {remote_poke:poke});
})

socket.on('init', function(data) {
    for(var i=18;i<36;i++){
        document.getElementById("location"+i).src="images/cardbg.png";
    }
    remote_poke = data.remote_poke;
})

socket.on('up', function(data) {
    remote_id = data.remote_id + 18;
    document.getElementById("location"+remote_id).src="images/eevee/card"+remote_poke[remote_id-18]+".jpg";
})

socket.on('back', function(data) {
    remote_id = data.remote_id + 18;
    remote_oneid = data.remote_oneid + 18;
    document.getElementById("location"+remote_id).src="images/cardbg.png";
    document.getElementById("location"+remote_oneid).src="images/cardbg.png";
})

socket.on('leave', function(){
    $("#box").show(); 
    $("#result").hide();
    $("#hidesteps").hide();  
    $("#upload2").hide();
    document.getElementById('offline').innerHTML = "Your opponent is offline.";
    document.getElementById('result').innerHTML = "You win!";
})

socket.on('lose', function(){
    $("#box").show();
    $("#hidesteps").hide(); 
    $("#upload2").hide();
    document.getElementById("result").innerHTML="You lose!";
})

socket.on('getname', function(data){
    document.getElementById('remotename').innerHTML = data.remotename+"'s Game Area";
})

