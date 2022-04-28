import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
    const [credentials, setCredentials] = useState({email:"" , password:""});
    const navigate = useNavigate();


    const handleSubmit = async (e)=>{
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({email: credentials.email, password: credentials.password})
          });
        const json = await response.json()
        console.log(json);
        if(json.success){
            //Save the Auth token and redirect
            localStorage.setItem('token', json.authtoken);
            props.showAlert("Successfully Logged In","success")
            navigate("/");
        }
        else{
            props.showAlert("Invalid Details","danger");
        }

    }
        const onChange = (e)=>{
            setCredentials({...credentials,[e.target.name]: e.target.value})
            }
  return (
    <div className='mt-3'>
        <h3>Login to iNoteBook</h3>
        <form onSubmit={handleSubmit}>
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" className="form-control" id="email" value={credentials.email} onChange={onChange} name='email' aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" className="form-control" id="password" value={credentials.password} onChange={onChange} name='password'/>
  </div>
  <button type="submit" className="btn btn-primary" >Login</button>
</form>
    </div>
  )
}

export default Login