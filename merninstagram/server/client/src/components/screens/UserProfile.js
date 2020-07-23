import React,{useEffect,useState,useContext} from 'react';
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'

const Profile = ()=>{
    const [userProfile,setProfile] = useState(null)
    
    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [showFollow,setShowFollow] = useState(state?state.following.includes(userid):true)
    //console.log(userid)
    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            //console.log(result)
            setProfile(result)
        })
    },[])

    const followUser = ()=>{
        fetch('/follow',{
            method:"Put",
            headers:{
                "Content-Type" : "application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(result=>{
            //console.log(result)
            dispatch({type:"UPDATE",payload:{followers:result.followers,following:result.following}})
            localStorage.setItem("user",JSON.stringify(result))
            setProfile((prevstate)=>{
                return{
                    ...prevstate,
                    user:{
                        ...prevstate.user,
                        followers:[...prevstate.user.followers,result._id]
                    }
                }
            })
            setShowFollow(false)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method:"Put",
            headers:{
                "Content-Type" : "application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(result=>{
            //console.log(result)
            dispatch({type:"UPDATE",payload:{followers:result.followers,following:result.following}})
            localStorage.setItem("user",JSON.stringify(result))
            
            setProfile((prevstate)=>{
                const newFollower = prevstate.user.followers.filter(item=> item !== result._id)
                return{
                    ...prevstate,
                    user:{
                        ...prevstate.user,
                        followers:newFollower
                    }
                }
            })
            setShowFollow(true)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    return (
        <>
        {userProfile ?
            <div style={{maxWidth:"550px",margin:"0px auto"}}>
                <div style={{
                    display:"flex",
                    justifyContent:"space-around",
                    margin:"18px 0px",
                    borderBottom:"1px solid grey"
                }}>
                    <div>
                        <img style={{width:"160px",height : "160px",borderRadius:"80px"}}
                        src={userProfile.user.pic}
                        alt="Profile of the Person"/>
                    </div>
                    <div >
                        <h4>{userProfile.user.name}</h4>
                        <h5>{userProfile.user.email}</h5>
                        <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                            <h6>{userProfile.posts.length} Posts</h6>
                            <h6>{userProfile.user.followers.length} Followers</h6>
                            <h6>{userProfile.user.following.length} Following</h6>
                        </div>
                        {showFollow?
                            <button style={{margin:"10px"}} className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>followUser()}>
                                Follow
                            </button>
                        :
                            <button style={{margin:"10px"}} className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>unfollowUser()}>
                                Unfollow
                            </button>
                        }
                        
                        
                    </div>
                
                </div>
                <div className="gallery">
                    {
                        userProfile.posts.map(item=>{
                            return(
                                <img key={item._id} className = "item" src={item.photo}  alt= {item.title}/>
                            )
                        })
                    }
                </div>
            </div>
        :
        <h2>loading...</h2>
        }
        </>
    )
}

export default Profile