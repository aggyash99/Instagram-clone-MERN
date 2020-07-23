import React,{useState,useContext} from 'react';
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css';
import {UserContext} from '../../App'


const ResetPassword = ()=>{
    const history = useHistory()
    const [email,setEmail] = useState("")
    const PostData = ()=>{
        if(!/^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html:"Invalid Email",classes:"#c62828 red darken-3"})
            return
        }
        fetch("/resetpassword",{
            method:"post",
            headers:{
                "Content-Type" : "application/json"
            },
            body:JSON.stringify({
                email,
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html:data.error,classes:"#c62828 red darken-3"})
            }
            else{
                M.toast({html:data.message,classes:"#43a047 green darken-1"})
                history.push('/login')
            }
        })
        .catch (err=>{
            console.log(err)
        })
    }


    return (

        <div className="Mycard">
        <div className="card Auth-card input-field">
            <h2>Instagram</h2>
            <input type="text" placeholder="email"
            value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={()=>PostData()}>
                reset password
            </button>
        </div>
        </div>
        
    )
}

export default ResetPassword