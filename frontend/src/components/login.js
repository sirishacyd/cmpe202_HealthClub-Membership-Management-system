// Import the react JS packages 
import axios from "axios";
import {useState} from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import gymImage from './gym.jpg';
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
                         axios.post(process.env.REACT_APP_BACKEND_URL+'/login/',
                         user ,{headers: 
                        {'Content-Type': 'application/json'},
                         });

         // Initialize the access token, first_name, user_type in localstorage.     
         localStorage.clear();
         localStorage.setItem('token', data.token);
         localStorage.setItem('first_name', data.first_name);
         localStorage.setItem('user_type', data.user_type);
         localStorage.setItem('user_id', data.user_id);
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: `url(${gymImage})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            //width: "50%",
            opacity:0.9,
            backgroundColor: "white",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            padding: "1rem",
          }}
          className="Auth-form-container"
        >
          <form className="Auth-form" onSubmit={submit}>
            <div className="Auth-form-content">
              <h3 className="Auth-form-title">
                <FontAwesomeIcon
                  icon={faUser}
                  className="me-3"
                  style={{ marginRight: "2rem" }}
                />
                Welcome! Login here
              </h3>
              {error && (
                <div className="alert alert-danger">{error}</div>
              )}
              <div className="form-group mt-3">
                <label>Email Address</label>
                <input
                  className="form-control mt-1"
                  placeholder="Enter Your Email Address here"
                  name="username"
                  type="text"
                  value={username}
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group mt-3">
                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  className="form-control mt-1"
                  placeholder="Enter password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ marginBottom: "1rem" }}
                />
              </div>
              <div className="d-grid gap-6 mt-3" class="row justify-content-center">
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ backgroundColor: "#4B0082" }}
                >
                  Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      );
      
}