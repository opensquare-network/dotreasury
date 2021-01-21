import React from 'react';
import { useDispatch } from "react-redux";
import { useForm } from 'react-hook-form';

import { setLoggedInUser } from "../../store/reducers/userSlice";
import scanApi from "../../services/scanApi";
import { useIsMounted } from "../../utils/hooks"

function Register({ history }) {
  const { register, handleSubmit, errors } = useForm();
  const isMounted = useIsMounted();
  const dispatch = useDispatch();

  // Do login
  const onSubmit = async (formData) => {
    const signupResult = await scanApi.signup(formData.username, formData.email, formData.password);
    console.log(signupResult);
    if (isMounted.current) {
      dispatch(setLoggedInUser(signupResult));
    }
    history.push('/login');
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
      <div>
          <div>
            <label htmlFor="username">Username
              { errors.username
                && <span className="text-danger">
                    <span>*</span>
                  </span>
              }
            </label>
            <input name="username" type="text" ref={register({required: true})} />
          </div>
        </div>
        <div>
          <div>
            <label htmlFor="email">Email
              { errors.email
                && <span className="text-danger">
                    <span>*</span>
                  </span>
              }
            </label>
            <input name="email" type="text" ref={register({required: true})} />
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
        <div className="row mt-4">
          <div className="col">
            <input className="btn btn-primary mr-3" type="submit" value="Register" />
          </div>
        </div>
      </form>
    </div>
  );
}

export default Register;
