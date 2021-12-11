import React from "react";
import { logoutUser } from "../actions/actionUtils";
import { connect } from "react-redux";

function Logout(props) {
  const handleSubmit = (e) => {
    e.preventDefault();
    props.dispatch(logoutUser());
  };

  return (
    <div>
      <form method="POST" onSubmit={handleSubmit}>
        <button type="submit" className="btn btn-success mx-md-2">
          Logout
        </button>
      </form>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps)(Logout);
