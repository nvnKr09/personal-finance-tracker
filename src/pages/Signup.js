import React from 'react';
import Header from '../components/Header';
import SignupSignin from '../components/SignupSignin';

const Signup = () => {
  return (
    <>
      <Header/>
      <div className="wrapper">
        <SignupSignin />
      </div>
    </>
  )
}

export default Signup;