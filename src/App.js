import React from 'react';

import './App.css';

import Button from 'react-bootstrap/Button';

import Navbar from 'react-bootstrap/Navbar';

import Card from 'react-bootstrap/Card';

import Carousel from 'react-bootstrap/Carousel';

import { Route, Link, Redirect } from 'react-router-dom';

import * as firebase from "firebase/app";

import "firebase/auth";

import axios from "axios";


var firebaseConfig = {
  apiKey: "AIzaSyCas0vqL8saFqtbZtRYGNnNwiiTp0_FC2Q",
  authDomain: "e-commerce-mobile1.firebaseapp.com",
  databaseURL: "https://e-commerce-mobile1.firebaseio.com",
  projectId: "e-commerce-mobile1",
  storageBucket: "e-commerce-mobile1.appspot.com",
  messagingSenderId: "925640523783",
  appId: "1:925640523783:web:096f676e7e461823"
}; 

// Initialize Firebase

firebase.initializeApp(firebaseConfig);



class Parent extends React.Component

{

  

  constructor(props){

    super(props)

    this.state={}

    this.state.db={



      products:[],

      newproducts:[],

      cart:[],

    }

  }





    componentDidMount()

  {

    this.loginCheck()

    axios.get(`/getProduct`)

    .then(res => {

      let db = this.state.db;

      db.products= res.data;

     console.log(db)

     this.setState({ db});

    })



    axios.get(`/getNewProduct`)

    .then(res => {

      let db = this.state.db;

      db.newproducts= res.data;

     console.log(db)

     this.setState({ db});

    })

  

    

    

  }



  getCart(uid)

  {

    axios.get("/getCart?uid="+uid)

    .then(res => {

      let db = this.state.db;

      db.cart= res.data;

     console.log(db)

     this.setState({ db});

    })

  }

  



   

loginCheck(){

  firebase.auth().onAuthStateChanged((user) => {

    if (user) {

      this.setState({

        user:user

      })

      this.getCart(user.uid)

      console.log("logged in",user)

    } else {

      console.log("logged out")

    }

  })

  

}



    googleLogin(){

      var provider = new firebase.auth.GoogleAuthProvider();

  

  

      firebase.auth().signInWithPopup(provider).then((result) => {

        // This gives you a Google Access Token. You can use it to access the Google API.

        var token = result.credential.accessToken;

        // The signed-in user info.

        var user = result.user;

        this.setState({

          user:user

        })

        

        console.log(user)

        console.log(user.displayName,user.email);

        

        // ...

      }).catch(function(error) {

        // Handle Errors here.

        var errorCode = error.code;

        var errorMessage = error.message;

        // The email of the user's account used.

        var email = error.email;

        // The firebase.auth.AuthCredential type that was used.

        var credential = error.credential;

        // ...

      });

    }





    logOut(){

      firebase.auth().signOut().then(() => {

         this.setState({

           user:""

         })

        }).catch(function(error) {

        // An error happened.

        });

    }



   

    emailSignUp=({email,password})=>

    { 

      firebase.auth().createUserWithEmailAndPassword(email, password).then((result)=>{



        // The signed-in user info.

        

        var user = result.user;

      

        this.props.history.push('/home')

        

        console.log("email signup",user.displayName,user.email);

        

        // ...

        

        })

        

        .catch(function(error) {

        

        // Handle Errors here.

        

        var errorCode = error.code;

        

        var errorMessage = error.message;

        

        if (errorCode === 'auth/weak-password') {

        

        alert('The password is too weak.');

        

        } else {

        

        alert(errorMessage);

        

        }

        

        console.log(error);

        

        });

  

      }

      

      emailSignIn=({email,password})=>

      {

    

        firebase.auth().signInWithEmailAndPassword(email, password).then((result)=>{



          // The signed-in user info.

          

          var user = result.user;

          

          console.log("email signin",user.displayName,user.email);

          

          this.setState({

          

          user:user})

          

          this.props.history.push('/home')

          

          // ...

          

          })

          

          .catch(function(error) {

          

          // Handle Errors here.

          

          var errorCode = error.code;

          

          var errorMessage = error.message;

          

          if (errorCode === 'auth/wrong-password') {

          

          alert('Wrong password.');

          

          } else {

          

          alert(errorMessage);

          

          }

          

          console.log(error);

          

          // ...

          

          });

  



      }



    addProductToCart(item){

      let db = this.state.db

      item.uid=this.state.user.uid

      axios.post("/cart", item).then(

    (res)=>{

      db.cart.push(res.data);

      console.log(db.cart);

      this.setState(

        {db}

      )

    })

     }

   



     changeQuantity(item,e){

      let db = this.state.db;

      let i = db.cart.indexOf(item)

      db.cart[i].quantity = parseInt(e.target.value); 

      let p=parseInt(e.target.value);

      let q=item.price.replace(/,/g, "")

      console.log(q)

      item.total=p*q

      item.total=item.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      this.setState(

        {db:db}

      )

      console.log(db);

    }

   

    removeProductFromCart=(item)=>

    {

     let db=this.state.db;

     axios.delete(`/remove/${item._id}`)

     .then(res => {

       console.log(res);

       console.log(res.data)

       this.setState(

        {db:db}

      )

     window.location.reload();

    })

    }

    

  render()

  {

  return <div>

   <div>

   <Navbar className="row" bg="primary" variant="dark" fixed="top">

   <Navbar.Brand className="offset-sm-5">

     <img

     src={"/logo.png"}

     width="30"

     height="30"

     className="d-inline-block align-top"

     alt=""

   />

  {'Mobile Shop'}

   </Navbar.Brand>

   <Link className="offset-sm-3 offset-2" to="/Add_to_Cart">

    {(this.state.user)?<Navbar.Brand >

    <img

        src={"/cart.png"}

        width="30"

        height="30"

        className="d-inline-block align-top"

        alt=""

      />

     {'Cart'}

    </Navbar.Brand> :""}

    </Link>

    

    <Navbar.Brand className="offset-sm-1 offset-2"  href="/"  onClick={this.logOut}>

      {(this.state.user)?"Logout" :""}

    </Navbar.Brand>

  



  </Navbar><br/><br/><br/>

    

    <Route exact path="/"  render={props=>(!this.state.user)?<Login {...props} googleLogin={this.googleLogin.bind(this)}  emailSignIn={this.emailSignIn.bind(this)}></Login> :<Redirect to="/home"></Redirect>}/>

    <Route exact path="/signup" render={props=>(!this.state.user)?<Signup {...props} googleLogin={this.googleLogin.bind(this)}  emailSignUp={this.emailSignUp.bind(this)}></Signup>:<Redirect to="/home"></Redirect>}/>

    <Route exact path="/home" render={props=><Home {...props} db={this.state.db}></Home>}/>

    {this.state.user?<Route exact path="/feature/:pid"  render={props=><CartResult {...props} db={this.state.db} addProduct={this.addProductToCart.bind(this)}></CartResult>}/>:""}

    <Route exact path="/Add_to_Cart" render={props=><AddCart {...props} db={this.state.db} changeQuantity={this.changeQuantity.bind(this)} removeProduct={this.removeProductFromCart.bind(this)}></AddCart>}/>

    

  </div>

  </div>

}

}



function Login(props)

  {

    let email;

    let password;



  return <div> 

  

  <div className="container">

 <label htmlFor="email"><b>Email</b></label>

   <input type="text" placeholder="Enter Email"  onChange={(e)=>{email=e.target.value}} required/>



   <label htmlFor="psw"><b>Password</b></label>

   <input type="password" placeholder="Enter Password" onChange={(e)=>{password=e.target.value}} required/>

   </div>



<Button className="col-4 col-sm-2 offset-sm-5 offset-4"  variant="primary" type="submit" onClick={()=>{props.emailSignIn({email,password})}} >Log in

</Button>



<p className="offset-6 mt-3">OR</p>



<Button className="col-4 col-sm-2 offset-sm-5 offset-4" onClick={props.googleLogin}>Log in with Google

</Button>





<p className="col-8 clo-sm-4 offset-sm-4 offset-2 mt-3">Don't have an account? 

  <Link to="/signup">Sign up</Link>

    </p>





</div>

}





function Signup(props)

{

  let email;

  let password;

   return  <div> 

  

 

  <div className="container">

    <h1>Sign Up</h1>

    <p>Please fill in this form to create an account</p>

    <hr/>

    <label ><b>Name</b></label>

    <input type="text" placeholder="Enter Name" required/>



    <label htmlFor="email"><b>Email</b></label>

    <input type="text" placeholder="Enter Email"  onChange={(e)=>{email=e.target.value}} required/>



    <label htmlFor="psw"><b>Password</b></label>

    <input type="password" placeholder="Enter Password" onChange={(e)=>{password=e.target.value}} required/>



    <label htmlFor="psw-repeat"><b>Repeat Password</b></label>

    <input type="password" placeholder="Repeat Password" name="psw-repeat" required/>

    </div>





<Button className="col-4 col-sm-2 offset-sm-5 offset-4"  variant="primary" type="submit" onClick={()=>{props.emailSignUp({email,password})}} >Sign up

</Button>





<p className="offset-6 mt-3">OR</p>



<Button className="col-4 col-sm-2 offset-sm-5 offset-4" onClick={props.googleLogin}>Log in with Google

</Button>









    <p className="col-8 clo-sm-4 offset-sm-4 offset-2 mt-3">Have an account?

    <Link to="/">Log in</Link>

    </p>

  

</div>

} 





function Home(props)

{



 let l1=props.db.newproducts.map((product)=>

  <Carousel.Item>

   <Link to={`/feature/`+product._id}>

    <img

      className="offset-5"

      height="200"

      width=""

      src={product.imgs[0]}

      alt=""

    />

    <Carousel.Caption>

      <h3>{product.name}</h3>

    </Carousel.Caption>

    </Link> 

  </Carousel.Item>

 

  );

  

  

  



  let l=props.db.products.map((product)=>

  <Card style={{ width: '12rem' }} className="m-4">

  <Link to={`/feature/`+product._id} >

  

 <Card.Img  height="275" width="" variant="top" src={product.imgs[0]}  />

 

 <Card.Body>

   <Card.Title>{product.name}</Card.Title>

   

   <Card.Text>

     {product.price}

   </Card.Text>

 </Card.Body>

 </Link>

</Card>



);



  return <div> 

   

<Carousel  className="mb-5">{l1}</Carousel>

  <div  className="row">{l}</div>

</div>

}





function CartResult(props)

{



  let obj=props.db.products.find((p)=>p._id===props.match.params.pid)



  if(obj)

  {}

  else

  {

    obj=props.db.newproducts.find((p)=>p._id===props.match.params.pid)

  }



  console.log(obj)

 let l=[];

 l=obj.imgs.map((img)=>

 <Carousel.Item>

 <img

 className="offset-sm-5 offset-4"

 height="200"

 width=""

 src={img}

 alt=""

/>

</Carousel.Item>

 )



 let l1=[];

l1=obj.features.map((features)=>

<ul className="row">

<li className="col-sm-4 offset-sm-4 col-8 offset-2">{features}</li>

</ul>

)

   

    return <div>

      <Carousel className="mt-5 mb-5">{l}</Carousel>

      <h4 className="row offset-sm-4 offset-2">{obj.name}</h4>

     <div>{l1}</div>

     <h4 className="row offset-sm-4 offset-2">Price={obj.price}</h4>

    <Link to="/Add_to_Cart">

<Button className="col-7 col-sm-2 offset-sm-5 offset-3 mt-5 mb-2 "  variant="primary" type="submit" onClick={()=>{props.addProduct(obj)}} >Add to Cart

</Button>

</Link>

<Link to="/Buy_Now">

<Button className="col-7 col-sm-2 offset-sm-5 offset-3 mt-2"  variant="primary" type="submit">Buy Now

</Button>

</Link>

  </div>

  }



function AddCart(props)

{

  let l=[];

  l=props.db.cart.map((product)=>

  <div className="row mb-5">

       <img className="col-sm-1 col-3"

        src={product.imgs[0]}

         height="150"

         width=""

         alt="" />

       <h5 className="col-sm-2 offset-sm-2 col-4 offset-1 mt-5">{product.name}</h5>

       <h5 className="col-sm-1 offset-sm-0 col-2 offset-1  mt-5">{product.price}</h5>

       <input type="number" min="1" value={product.quantity}  className="col-sm-1 col-2 offset-1  offset-sm-1 mt-5 class1" onChange={(e)=>{props.changeQuantity(product,e)}}></input>

    

       <Button className="col-sm-1 col-3  offset-2 offset-sm-1 mt-5 class1" onClick={()=>{props.removeProduct(product)}}>

        Remove

      </Button>

  

      <h5 className="col-sm-1 col-2 offset-1 offset-sm-1 mt-5">{product.total}</h5>

   </div>

  );



  

  

    return <div>

         <h1>Shopping Cart</h1>

      <div className="row">

    <label className="col-sm-1 col-4 ">Image</label>

    <label className="col-sm-1 col-6 offset-sm-2">Product</label>

    <label className="col-sm-1 col-2 offset-sm-1">Price</label>

    <label className="col-sm-1 col-2 offset-2 offset-sm-1">Quantity</label>

    <label className="col-sm-1 col-2 offset-2 offset-sm-1">Remove</label>

    <label className="col-sm-1 col-2 offset-2 offset-sm-1">Total</label>

  </div>

  <div>{l}</div>

  <Link to="/Buy_Now">

<Button className="col-7 col-sm-2 offset-sm-5 offset-3"  variant="primary" type="submit">Proceed to Buy

</Button>

</Link>



</div>

}





export  default Parent;