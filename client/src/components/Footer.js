import React, { useState } from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function Footer() {
  const [value, setValue] = useState(0);
  return(
    <Paper sx={{ bottom: 0, left: 0, right: 0 }}>
  <BottomNavigation style={{backgroundColor: "rgb(0, 40, 80)"}}
  showLabels
  value={value}
  onChange={(event, newValue) => {
    setValue(newValue);
  }}
>
  <BottomNavigationAction icon={<GitHubIcon sx={{color: 'white'}}/>}/>
  <BottomNavigationAction icon={<LinkedInIcon sx={{color: 'white'}}/>}/>

</BottomNavigation>
</Paper>)
}

export default Footer;
