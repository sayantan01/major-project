import * as React from 'react';
import { useHistory } from "react-router-dom";

export default function MediaCard(props) {
  const history = useHistory()
  return (
    <div className="card text-white bg-dark" style={{width: '18rem'}} id="card">
  <img className="card-img-top" src={props.image} alt="Card image cap" />
  <div className="card-body">
    <h5 className="card-title" style={{color: 'orange'}}>{props.title}</h5>
    <p className="card-text my-2" style={{fontSize: 14}}>{props.text}</p>
    <button className="btn btn-success" onClick={() => history.push(props.url)}>Try it!</button>
  </div>
</div>
  );
}