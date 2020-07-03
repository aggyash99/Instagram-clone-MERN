import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import M from 'materialize-css';

const Signup = ()=>{

    const [name,setName] = useState("")
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const PostData = ()=>{
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type" : "application/json"
            },
            body:JSON.stringify({
                name:"",
                email:"",
                password:""
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html:data.error})
            }
            
        })
    }

    return (

        <div className="Mycard">
        <div className="card Auth-card input-field">
            <h2>Instagram</h2>
            <input type="text" placeholder="name"
            value={name} onChange={(e)=>setName(e.target.value)}/>
            <input type="text" placeholder="email"
            value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <input type="text" placeholder="password"
            value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={()=>PostData()} >
                Signup
            </button>
            <h5>
                <Link to="/login">Already have an account ?</Link>
            </h5>
        </div>
        
        </div>
        
    )
}

export default Signup