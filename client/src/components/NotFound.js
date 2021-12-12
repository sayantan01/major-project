import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

function NotFound(props) {
  return (
    <div className="container my-5">
      {props.token === null && <Redirect to="/Login" />}
      <img
        className="img-fluid mx-auto d-block"
        src="https://www.prestashop.com/sites/default/files/styles/blog_750x320/public/blog/2019/10/banner_error_404.jpg?itok=eAS4swln"
        alt="404 not found"
      />
    </div>
  );
}

const mapStateToProps = function (state) {
  return {
    token: state.token,
  };
};

export default connect(mapStateToProps)(NotFound);
