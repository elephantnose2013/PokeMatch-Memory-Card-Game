const express = require('express')
var app=express();//1
var session=require('express-session');//1
var FileStore=require('session-file-store')(session);//1
const path = require('path')
const PORT = process.env.PORT 
const app = express();
const { Pool } = require('pg');
var bodyParser = require('body-parser');


//var pool = new Pool({
//  user: 'postgres',
//  password: 'postgres',
//  host: 'localhost',
//  database: 'test',
//  port: 5432,
//});


var pool = new Pool({
  connectionString : process.env.DATABASE_URL
})

var identityKey='skey'//1
app.use(session({
  name:identityKey,
  secret:'chyingp',
  store:new FileStore(),
  saveUninitialized:false,
  resave:false,
  cookie:{
    maxAge:10*1000
  }
}));//1

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'views')))
app.set('view engine', 'ejs')





var users=require('./users')/items;
var findUser=function(name,password){
  return users.find(function(item){
    return item.name===name&&item.password===password;
  });
};
app.post('/login1',function(req,res,next){
  var sess=req.session;
  var user=findUser(req.body.name,req.body.password);
  if(user){
    requ.session.regenerate(function(err){
      if(err){
        return res.json({ret_code:2,ret_msg:'Filed'});
      }
      req.session.loginUser=user.name;
      res.json({ret_code:0,ret_msg:'Successd'});
    });
  }else{
    res.json({ret_code:1,ret_msg:'Error'});
  }
});
app.get('/logout',function(req,res,next){
  req.session.destroy(function(err){
    if(err){
      res.json({ret_code:2,ret_msg:'Logout filed'});
      return;
    }
    res.clearCokkie(identityKey);
    res.redirect('/');
  });
});
app.get('/',function(req,res,next){
  var sess=req.session;
  var loginUser=sess.loginUser;
  var isLogined=!!loginUser;
  res.render('index',{
    isLogined:isLogined,
    name:loginUser||''
  });
});












app.post('/login', function(req, res){
  var user=req.body.Lid;
  var pwd=req.body.Lpassword;
  console.log("result id is " + user);

  //gm
  if(user=='GM1' && pwd=='123'){
    res.redirect('https://stark-spire-21434.herokuapp.com/GM.html');
  }
  else{
    //query
    var match = "select * from players where id in " + "('" + user + "')" + ";"; 
    console.log(match);

    pool.query(match, function(error, result){

      console.log(result.rows);
    
	    if(result.rows.length == 0) {
        console.log("UseID dose not exist!");
        res.redirect('https://stark-spire-21434.herokuapp.com/wrongID.html');
	    }
	    else if(result.rows[0].password != pwd){
        console.log("Wrong password!");
        res.redirect('https://stark-spire-21434.herokuapp.com/wrongPassword.html');
      } 	  
      else{
        console.log("Login succeeded!");
        res.redirect('https://stark-spire-21434.herokuapp.com/homepage.html');
      } 
    });
  }
});


app.post('/signup', function(req, res){
	var sid=req.body.sid;
	var spass=req.body.spassword;
	var sname=req.body.sname;
	var sage=req.body.sage;
	var sques=req.body.squestion;
	var sans=req.body.sanswer;
	var insert = "insert into players values ("   + "'" +  sid      + "'" + "," 
                                                + "'" +  spass    + "'" + "," 
                                                + "'" +  sname    + "'" + "," 
                                                +        sage           + "," 
                                                +        sques          + "," 
                                                + "'" +  sans     + "'"     
                                                + ")"     
                                                + ";"  ;
                                        
  if (sid == "GM1"){
    console.log("Sorry!You can not sign up as GM!");
    res.redirect('https://stark-spire-21434.herokuapp.com/signup.html');
  }
  else{
	  console.log(insert);
 
    pool.query(insert, function(error, result){
      console.log(error);

    

      if(error.code == 42601) {
        console.log("Incomplete information!");
        res.redirect('https://stark-spire-21434.herokuapp.com/signup.html');
      }
      else if(error.code == 23505){
        console.log("Insert failed!");
        res.redirect('https://stark-spire-21434.herokuapp.com/signupFailed.html');
      }
      else{
          console.log("Insert succeeded!");
          var results = result.rows;
          console.log(results);
          res.redirect('https://stark-spire-21434.herokuapp.com/login.html');
      }
    });    
  }
})


app.post('/gmmessage', function(req, res){
  var mes=req.body.gmessage;
  var insert = "insert into gm_msg values ('"+mes+"');" 
  console.log(insert);
  pool.query(insert, function(error, result){
    if(error) {
      console.log("Insert failed!");
    }
    else{
      console.log("Insert succeeded!");
      var results = result.rows;
      console.log(results);
    } 
  });
  res.redirect('https://stark-spire-21434.herokuapp.com/GM.html');
}); // end of gm msg


app.post('/remove', function(req, res){
	var id3=req.body.Gdelete;
	var remove = "delete from players where id =" +    "'" + id3 + "'"  
                                                 + ";" ;   
  console.log(remove);

  pool.query(remove, function(error, result){
    //console.log(result);

	  if(result.rowCount) {
      console.log("Remove succeeded!");
      res.redirect('https://stark-spire-21434.herokuapp.com/deleteSucceeded.html');
	  }
	  else{
      //return console.error(error);
      console.log("Remove failed!");
      res.redirect('https://stark-spire-21434.herokuapp.com/deleteFailed.html');
	  } 	  
  });


// res.redirect('http://localhost:5000/main.html');
});



app.post('/search', function(req, res){
	var sid=req.body.gsearch;
	var search = "select * from players where id in " + "('" + sid + "')" + ";"; 
                                                   
  console.log(search);

  pool.query(search, function(error, result){
    //console.log(result);

	  if(result.rowCount) {
      console.log("Search succeeded!");
      //var results = result.rows;
      res.redirect('https://stark-spire-21434.herokuapp.com/searchSucceeded.html');
	  }
	  else{
      console.log("Search failed!");
      res.redirect('https://stark-spire-21434.herokuapp.com/searchFailed.html');
	  } 	   
  }); 	  

  //res.redirect('https://stark-spire-21434.herokuapp.com/GM.html');
// res.redirect('http://localhost:5000/main.html');
});


app.post('/modify', function(req, res){
  //var mid=req.body.mid;

  var mid=   "'" + "xyz" + "'" ;

  var mpassword=req.body.mpassword;
  var mname=req.body.mname;
  var mage=req.body.mage;
  var mquestion=req.body.mquestion;
  var manswer=req.body.manswer;

  var fp="update players set ";
  var sp= " where id = " + mid + ";";
  var tmp;

  if(mpassword){
    tmp= fp + "password = " + "'" + mpassword + "'" + sp;
    pool.query(tmp, function(error, result){
	    if(error) {
	      console.log("mod fail!");
	    }
    });
  }

  if(mname){
    tmp= fp + "name = " + "'" + mname + "'" + sp;
    pool.query(tmp, function(error, result){
	    if(error) {
	      console.log("mod fail!");
	    }
    });
  }

  if(mage){
    tmp= fp + "age = " + mage + sp;
    pool.query(tmp, function(error, result){
	    if(error) {
	      console.log("mod fail!");
	    }
    });
  }

// modify security question, get question from db?????
//security question 从heroku db 里的sec_q table 里取
//根据players 里sqnum，每个问题有个对应的数字
//Heroku pg:psql 登录

  if(mquestion){
    tmp= fp + "sqnum = " + mquestion + sp;
    pool.query(tmp, function(error, result){
	    if(error) {
	      console.log("mod fail!");
	    }
    });
  }

  if(manswer){
    tmp= fp + "ans = " + "'"+ manswer + "'" + sp;
    pool.query(tmp, function(error, result){
	    if(error) {
	      console.log("mod fail!");
	    }
    });
  }

  res.redirect('https://stark-spire-21434.herokuapp.com/homepage.html');
// res.redirect('http://localhost:5000/main.html');
});




// app.delete('/user/:id', (req, res) => {
//   console.log(req.params.id) 
//   // delete the user with id
// });
// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'ejs')
// app.get('/', (req, res) => res.render('pages/index'))



// app.get('/users/:id', function(req, res){
//   console.log(req.params.id);
// })

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))


