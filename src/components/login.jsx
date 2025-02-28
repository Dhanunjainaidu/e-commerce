import React, { useState,useEffect } from "react";
import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";
import "../styles/login.scss";
// import Copyright from "../components/Copyright";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import company_logo from "../assets/pinaca_logo.svg";
// import santaCap from "../assets/santaCap.png";
import { backendurl } from "../../env.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);
  const [modalLoading, setModalLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [tab, setTab] = useState('login');


  const navigate = useNavigate();
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);

    try {
      const response = await axios.post(
        `${backendurl}/login`,
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      console.log("data", data);
      console.log(response.status); // Logs HTTP status code of the response

      if (response.status === 200) {
        console.log("Login successful:", data);
        // Save tokens and user details
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("userrole", data.role);
        localStorage.setItem("username", data.username);
        localStorage.setItem("name", data.name);
        // Redirect based on role
        navigate(`/${data.role}`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.status === 401) {
        // Unauthorized, check the error message from backend
        if (error.response.data.msg === "Incorrect password") {
          alert("The password you entered is incorrect. Please try again.");
        } else if (error.response.data.msg === "Invalid user") {
          alert(
            "The Username you entered does not exist. Please check your Username."
          );
        } else {
          alert("Login failed. Please check your credentials.");
        }
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleForgotPasswordSubmit = () => {
    if (!forgotEmail) {
      alert("Please enter your email.");
      return;
    }

    setModalLoading(true);

    fetch(`${backendurl}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: forgotEmail }),
    })
      .then((response) => {
        // Check if the response is JSON before parsing
        if (response.headers.get("Content-Type").includes("application/json")) {
          return response.json();
        } else {
          throw new Error("Non-JSON response received");
        }
      })
      .then((data) => {
        setModalLoading(false);
        if (data.status) {
          alert(
            "A password reset email has been sent to your email address. Please check your inbox."
          );
          setShowForgotPassword(false); // Close modal
          setForgotEmail(null);
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        setModalLoading(false);
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      });
  };

  return (
    <div className=" min-vh-100 main_container">
      <div className="transprantBG">
      {/* <div className="row w-100"> */}
        
        {/* Left Side - Login Form */}
        <div className="col-12 col-md-6 col-lg-6 d-flex flex-column gap4 justify-content-center align-items-center">
          
          <div className="card login-card p-4 shadow w-100 ">
            <div className="d-flex align-center justify-content-center">
              <div className="gold-overlay ">
                {/* <img
                  src={company_logo}
                  alt="Pinaca Logo"
                  className="main_logo"
                /> */}
              </div>

              <h1 className="login_pinaca">E commerce</h1>
            </div>
            <h2
              className="text login_text"
              style={{
                fontFamily: "lato",
                textAlign: "left",
                fontSize: "22px",
              }}
            >
              {tab==='login'?'Login':'Create account'}
            </h2>
            {tab==='login'?
            <form onSubmit={handleLoginSubmit} className="mb-4 p-1">
              <div className="mb-4 mt-4 position-relative d-flex align-items-center">
              <span
            
                    className="input-group-icon"
                   
                  >
                    <FaUser />
                  </span>
                <div className="input-group " >
                 
                  <input
                    style={{ borderRadius: "5px" , padding:"5px" }}
                    type="text"
                    placeholder="Enter your Employee ID"
                    className="form-controlL"
                    id="email"
                    value={email}
                    autoFocus
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                    aria-label="Employee ID"
                  />
                </div>
              </div>
              <div className="mb-4 mt-4 position-relative d-flex">
              <span
             
                    className="input-group-icon"
                   
                  >
                    <FaLock />
                  </span>
                <div className="input-group" style={{ position: "relative" }}>
                 
                  <input
                    style={{ borderRadius: "5px", paddingRight: "35px", padding:"2px"}}
                    type={passwordVisible ? "text" : "password"}
                    className="form-controlL"
                    placeholder="Enter your Password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    aria-label="Password"
                  />
                 
                </div>
                <span
                    style={{
                      position: "absolute",
                      right: "0px",
                      top: "0px",
                      backgroundColor:"transparent",
                      color:"#000b45",
                      
                    }}
                    className="input-group-icon password-toggle"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
              </div>
              <div className="text-start ">
                <span
                  type="button"
                  className="forgotPass p-0 "
                  onClick={() => setShowForgotPassword(true)}
                  style={{ fontFamily: "lato", fontSize: "15px" }}
                >
                  Forgot Password?
                </span>
              </div>
              <button
                type="submit"
                className="loginbtn mt-3"
                style={{ backgroundColor: "#e0a100" }}
              >
               LOGIN
              </button>
              <div className="pt-2 copyrighttt" style={{ fontFamily: "lato" }}>
                <span>Need an account? <p onClick={() => setTab('create')}
style={{color:'blue'}}>Create acccount</p></span>
              </div>
            </form>:
            <form onSubmit={handleLoginSubmit} className="mb-4 p-1">
            <div className="mb-4 position-relative d-flex align-items-center">
            <span
          
                  className="input-group-icon"
                 
                >
                  <FaUser />
                </span>
              <div className="input-group " >
               
                <input
                  style={{ borderRadius: "5px" , padding:"5px" }}
                  type="text"
                  placeholder="Enter your email id"
                  className="form-controlL"
                  id="email"
                  value={email}
                  autoFocus
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="useremail"
                  aria-label="Email"
                />
              </div>
            </div>
            <div className="mb-4 position-relative d-flex align-items-center">
            <span
          
                  className="input-group-icon"
                 
                >
                  <FaUser />
                </span>
              <div className="input-group " >
               
                <input
                  style={{ borderRadius: "5px" , padding:"5px" }}
                  type="text"
                  placeholder="Enter your name"
                  className="form-controlL"
                  id="email"
                  value={email}
                  autoFocus
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  aria-label="User Name"
                />
              </div>
            </div>
            <div className="mb-3 position-relative d-flex">
            <span
           
                  className="input-group-icon"
                 
                >
                  <FaLock />
                </span>
              <div className="input-group" style={{ position: "relative" }}>
               
                <input
                  style={{ borderRadius: "5px", paddingRight: "35px", padding:"2px"}}
                  type={passwordVisible ? "text" : "password"}
                  className="form-controlL"
                  placeholder="Enter your Password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  aria-label="Password"
                />
               
              </div>
              <span
                  style={{
                    position: "absolute",
                    right: "0px",
                    top: "0px",
                    backgroundColor:"transparent",
                    color:"#000b45",
                    
                  }}
                  className="input-group-icon password-toggle"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
            </div>
            <div className="mb-3 position-relative d-flex">
            <span
           
                  className="input-group-icon"
                 
                >
                  <FaLock />
                </span>
              <div className="input-group" style={{ position: "relative" }}>
               
                <input
                  style={{ borderRadius: "5px", paddingRight: "35px", padding:"2px"}}
                  type={passwordVisible ? "text" : "password"}
                  className="form-controlL"
                  placeholder="Reenter your Password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="confirm-password"
                  aria-label="Confirm Password"
                />
               
              </div>
              <span
                  style={{
                    position: "absolute",
                    right: "0px",
                    top: "0px",
                    backgroundColor:"transparent",
                    color:"#000b45",
                    
                  }}
                  className="input-group-icon password-toggle"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
            </div>
            <div className="text-start ">
              <span
                type="button"
                className="forgotPass p-0 "
                onClick={() => setShowForgotPassword(true)}
                style={{ fontFamily: "lato", fontSize: "15px" }}
              >
                Forgot Password?
              </span>
            </div>
            <button
              type="submit"
              className="loginbtn mt-3"
              style={{ backgroundColor: "#e0a100" }}
            >
             LOGIN
            </button>
            <div className="pt-2 copyrighttt" style={{ fontFamily: "lato" }}>
              <span>Need an account? <p onClick={() => setTab('login')}
              style={{color:'blue'}}>Create acccount</p></span>
            </div>
          </form>
            }


            {showForgotPassword && (
              <div className="modal-overlay d-flex justify-content-center align-items-left">
                <div className="modal-content p-4 shadow rounded">
                  <h5 className="mb-3">Forget Password</h5>
                  <label className="form-label">Email:</label>
                  <input
                    type="email"
                    className="form-control mb-3"
                    placeholder="Enter your email..."
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={handleForgotPasswordSubmit}
                      disabled={modalLoading || !forgotEmail}
                    >
                      {modalLoading ? (
                        <span className="spinner-border spinner-border-sm"></span>
                      ) : (
                        "Send Link"
                      )}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowForgotPassword(false)}
                    >
                      Close
                    </button>
                  </div>

                  {emailSent && (
                    <div className="mt-3 text-center">
                      <p className="text-success">
                        Check your mail to reset your password.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - PINACA Text */}
     
      {/* </div> */}
    </div>
    </div>
  );
};

export default Login;
