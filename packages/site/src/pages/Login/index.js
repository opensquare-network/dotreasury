import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import queryString from 'query-string';
import { useForm } from 'react-hook-form';

import { loggedInUserSelector, setLoggedInUser } from "../../store/reducers/userSlice";


function Login({ location }) {
  const loggedInUser = useSelector(loggedInUserSelector);
  const { register, handleSubmit, errors } = useForm();

  // Redirect out of here if user has already logged in
  if (loggedInUser) {
    const q = queryString.parse(location.search);
    return <Redirect to={q.returnUrl || '/'} />;
  }

  // Do login
  const onSubmit = (formData) => {
    // AuthService.login(formData.username, formData.password).then(res => {
    //   if (!res.data.error) {
    //     setLoggedInUser(res.data.result);
    //   }
    // });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div>
            <label htmlFor="username">Username
              { errors.username
                && <span>
                    <span>*</span>
                  </span>
              }
            </label>
            <input name="username" type="text" ref={register({required: true})} />
          </div>
        </div>
        <div>
          <div>
            <label htmlFor="password">Password
              { errors.password
                && <span>
                    <span>*</span>
                  </span>
              }
            </label>
            <input name="password" type="password" ref={register({required: true})} />
          </div>
        </div>
        { (data && data.error)
          && <div>
              <div>
                <ul>
                  { data.message.map((item, key) => (
                      <li key={key}>
                        <strong>{item}.</strong>
                      </li>
                    )) }
                </ul>
              </div>
            </div>
        }
        <div>
          <div>
            <input type="submit" value="Login" />/<Link to="/register">Register new user</Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
