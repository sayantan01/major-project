import React from "react";
import { connect } from "react-redux";

function User(props) {
  return (
    <div>
      <p style={{ color: "white" }} className="mx-md-5 my-2">
        Hello {props.email.split("@")[0]}
      </p>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    email: state.email,
  };
};

export default connect(mapStateToProps)(User);
