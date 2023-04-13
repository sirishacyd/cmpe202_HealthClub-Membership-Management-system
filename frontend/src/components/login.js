// Import the react JS packages 
import axios from "axios";
import {useState} from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Define the Login function.
export const Login = () => {
     const [username, setUsername] = useState('');
     const [password, setPassword] = useState('');
     const [error, setError] = useState('');
     // Create the submit method.
     const submit = async e => {
          e.preventDefault();
          const user = {
                username: username,
                password: password
               };
               try{
          // Create the POST requuest
          const {data} = await                                                                            
                         axios.post('http://localhost:8000/login/',
                         user ,{headers: 
                        {'Content-Type': 'application/json'},
                         });

         // Initialize the access token, first_name, user_type in localstorage.      
         localStorage.clear();
         localStorage.setItem('token', data.token);
         localStorage.setItem('first_name', data.first_name);
         localStorage.setItem('user_type', data.user_type);
         console.log(data.token);
         axios.defaults.headers.common['Authorization'] = 
                                         `token ${data['token']}`;
         if(localStorage.getItem('user_type') === 'Member'){                   
                                          window.location.href = '/memberhome/home';
                                      }
                                      else if (localStorage.getItem('user_type') === 'Admin') {
                                        window.location.href = '/adminhome/home';
                                      } else {
                                        window.location.href = '/';
                                      } 
                                    }catch (error) {
                                        setError("Login failed. Please check your credentials and try again.");
                                        setTimeout(() => {
                                          setError('');
                                     }, 3000);
         
                         }  
                        }                      
    return(
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '85vh',
      }}>
        <div className="Auth-form-container" style={{
          maxWidth: '400px',
          width: '100%',
        }}>
          <form className="Auth-form" onSubmit={submit}>
            <div className="Auth-form-content">
              <h3 className="Auth-form-title">
              <FontAwesomeIcon icon={faUser} className="me-3" style={{ marginRight: '2rem' }} />
  Welcome ! Login here
              </h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="form-group mt-3">
                <label>Email Address</label>
                <input className="form-control mt-1" 
                  placeholder="Enter Your Email Address here" 
                  name='username'  
                  type='text' value={username}
                  required 
                  onChange={e => setUsername(e.target.value)}/>
              </div>
              <div className="form-group mt-3">
                <label>Password</label>
                <input name='password' 
                  type="password"     
                  className="form-control mt-1"
                  placeholder="Enter password"
                  value={password}
                  required
                  onChange={e => setPassword(e.target.value)}
                  style={{ marginBottom: '1rem' }}/>
              </div>
              <div className="d-grid gap-6 mt-3" class="row justify-content-center">
                <button type="submit" 
                  className="btn btn-primary">Login</button>
              </div>
            </div>
          </form>
        </div>
      </div>
     )
}