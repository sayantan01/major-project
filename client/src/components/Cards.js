import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function MediaCard(props) {
  return (
    <div className="card text-white bg-dark" style={{width: '18rem'}} id="card">
  <img className="card-img-top" src={props.image} alt="Card image cap" />
  <div className="card-body">
    <h5 className="card-title" style={{color: 'orange'}}>{props.title}</h5>
    <p className="card-text my-2" style={{fontSize: 14}}>{props.text}</p>
  </div>
</div>
  );
}