import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#F26F21', 
      contrastText: '#FFFFFF', 
    },
    secondary: {
      main: '#000000', 
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF', 
    },
  },
});

export default theme;