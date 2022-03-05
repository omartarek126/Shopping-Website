var express = require('express');
var path = require('path');
const session = require('express-session');
var app = express();
app.use(session({secret: 'mySecret', resave: false, saveUninitialized: false}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var searchKeyword = "";
app.get('/', function(req,res){
  res.render('login',{errorMessage: ''});
});
app.get('/registration', function (req,res){
  res.render('registration',{errorMessage: ''});
});
app.get('/home',function(req,res){
  var currentUser=req.session.context;
  if(currentUser!=null){
    res.render('home');
  }
  else{
    res.redirect('/');
  }
});
app.get('/books',function(req,res){
  var currentUser=req.session.context;
  if(currentUser!=null){
    res.render('books')
  }
  else{
    res.redirect('/');
  }
});
app.get('/sports',function(req,res){
  var currentUser=req.session.context;
  if(currentUser!=null){
    res.render('sports')
  }
  else{
    res.redirect('/');
  }
});
app.get('/phones',function(req,res){
  var currentUser=req.session.context;
  if(currentUser!=null){
    res.render('phones')
  }
  else{
    res.redirect('/');
  }
});
app.get('/cart',function(req,res){
  var currentUser=req.session.context;
  if(currentUser!=null){
    async function main(){ 
      var {MongoClient} = require('mongodb'); 
      var url = "mongodb+srv://admin:admin@cluster0.gugn9.mongodb.net/Projectdb?retryWrites=true&w=majority"
      var client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
      await client.connect();
      var userCart = await client.db('Projectdb').collection('Cart').find({username:currentUser}).toArray();
      var newCart = userCart[0].cart;
      res.render('cart', {cartItems : newCart})
    client.close();
    }
  main().catch(console.error);
  }
  else{
    res.redirect('/');
  }
});
app.get('/boxing',function(req,res){
  var currentUser=req.session.context;
  if(currentUser!=null){
    res.render('boxing',{successMessage: '', errorMessage: ''})
  }
  else{
    res.redirect('/');
  }
});
app.get('/galaxy',function(req,res){
  var currentUser=req.session.context;
  if(currentUser!=null){
    res.render('galaxy',{successMessage: '', errorMessage: ''});
  }
  else{
    res.redirect('/');
  }
});
app.get('/iphone',function(req,res){
  var currentUser=req.session.context;
  if(currentUser!=null){
    res.render('iphone',{successMessage: '', errorMessage: ''})
  }
  else{
    res.redirect('/');
  }
});
app.get('/leaves',function(req,res){
  var currentUser=req.session.context;
  if(currentUser!=null){
    res.render('leaves',{successMessage: '', errorMessage: ''})
  }
  else{
    res.redirect('/');
  }
});
app.get('/sun',function(req,res){
  var currentUser=req.session.context;
  if(currentUser!=null){
    res.render('sun',{successMessage: '', errorMessage: ''})
  }
  else{
    res.redirect('/');
  }
});
app.get('/tennis',function(req,res){
  var currentUser=req.session.context;
  if(currentUser!=null){
    res.render('tennis',{successMessage: '', errorMessage: ''})
  }
  else{
    res.redirect('/');
  }
});
app.get('/searchresults',function(req,res){
  var currentUser=req.session.context;
  if(currentUser!=null){
    res.render('searchresults',{searchWord: searchKeyword});
    searchKeyword="";
  }
  else{
    res.redirect('/');
    searchKeyword="";
  }
});

app.post('/', function(req,res){
  var user = req.body.username;
  var pass = req.body.password;
  if(req.body.username == "" || req.body.password ==""){
    res.render('login',{errorMessage: 'Username and Password Cannot Be Empty!'})
  }
  else if(req.body.username.trim()!=req.body.username || req.body.password.trim()!=req.body.password){
    res.render('login',{errorMessage: 'Username and Password Cannot Contain Spaces!'})
  }
  else{
    async function main(){
      var {MongoClient} = require('mongodb');
      var url = "mongodb+srv://admin:admin@cluster0.gugn9.mongodb.net/Projectdb?retryWrites=true&w=majority"
      var client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
      await client.connect();
      var retrieveUsers = await client.db('Projectdb').collection('Users').find().toArray();
      var found = false;
      for(let i=0; i<retrieveUsers.length;i++){
        if(retrieveUsers[i].username == user){
          found = true;
          if(retrieveUsers[i].password == pass){
              req.session.context =req.body.username;
              res.redirect('/home');
          }
          else{
            res.render('login',{errorMessage: 'Wrong Password'})
          }
        }
      }
      if(!found){
        res.render('login',{errorMessage: 'Unregistered User, Register Below!'})
      }
      client.close();
    }
    main().catch(console.error);
  }
});

app.post('/register', function(req,res){
  var newUser = {username: req.body.username, password: req.body.password};
  var newCart = {username: req.body.username, cart:[]};
  if(req.body.username=="" || req.body.password==""){
    res.render('registration',{errorMessage: 'Username and Password Cannot Be Empty!'});
  }
  else if(req.body.username.trim()!=req.body.username || req.body.password.trim()!=req.body.password){
    res.render('registration',{errorMessage: 'Username and Password Cannot Contain Spaces!'});
  }
  else{
    async function main(){ 
      var {MongoClient} = require('mongodb'); 
      var url = "mongodb+srv://admin:admin@cluster0.gugn9.mongodb.net/Projectdb?retryWrites=true&w=majority"
      var client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
      await client.connect();
      var retrieveUsers = await client.db('Projectdb').collection('Users').find().toArray();
      var found = false;
      for(let i=0; i<retrieveUsers.length;i++){
        if(retrieveUsers[i].username == newUser.username){
          found = true;
        }
      }
      if(!found){
        await client.db('Projectdb').collection('Users').insertOne(newUser);
        await client.db('Projectdb').collection('Cart').insertOne(newCart);
        req.session.context = req.body.username;
        res.redirect('/home');
      }
      else{
        res.render('registration',{errorMessage: 'Username already exists!'});
      }
      client.close();
    }
    main().catch(console.error);
  }
});

app.post('/addCart',function(req,res){
  var chosenItem = req.body.item;
  var currentUser=req.session.context;
  async function main(){ 
    var {MongoClient} = require('mongodb'); 
    var url = "mongodb+srv://admin:admin@cluster0.gugn9.mongodb.net/Projectdb?retryWrites=true&w=majority"
    var client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
    await client.connect();
    var userCart = await client.db('Projectdb').collection('Cart').find({username:currentUser}).toArray();
    if(userCart[0].cart.indexOf(chosenItem)==-1){
      userCart[0].cart.push(chosenItem);
      var newCart = userCart[0].cart;
      await client.db('Projectdb').collection('Cart').findOneAndReplace({username:currentUser},{username:currentUser,cart:newCart});
      res.render(chosenItem,{successMessage: 'You Added This Item Successfully!', errorMessage: ''});
    }
    else{
      res.render(chosenItem,{successMessage: '', errorMessage: 'Product is Already in Your Cart!'});
    }
  client.close();
  }
main().catch(console.error);
});

app.post('/removeCart',function(req,res){
  var currentUser=req.session.context;
  var removedItem = req.body.item;
  async function main(){ 
    var {MongoClient} = require('mongodb'); 
    var url = "mongodb+srv://admin:admin@cluster0.gugn9.mongodb.net/Projectdb?retryWrites=true&w=majority"
    var client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
    await client.connect();
    var userCart = await client.db('Projectdb').collection('Cart').find({username:currentUser}).toArray();
    userCart[0].cart.splice(userCart[0].cart.indexOf(removedItem),1);
    var newCart = userCart[0].cart;
    await client.db('Projectdb').collection('Cart').findOneAndReplace({username:currentUser},{username:currentUser,cart:newCart});
    res.redirect('/cart');
  client.close();
  }
  main().catch(console.error);
});

app.post('/search',function(req,res){
  searchKeyword = req.body.Search
  res.redirect('/searchresults');
});

app.post('/logOut',function(req,res){
  req.session.context=null;
  res.redirect('/')
});
app.listen(3000);