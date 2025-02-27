import React from 'react';
import { Typography, Button, Grid, Paper, Container } from '@mui/material';

const WelcomePage = ({ userInfo, handleLogout }) => {
  return (
    <Container maxWidth="md" style={{ marginTop: '40px' }}>
      <Paper style={{ padding: '20px' }}>
        <Typography variant="h4" gutterBottom align="center">
          Welcome, {userInfo.name}!
        </Typography>
        <Typography variant="body1" gutterBottom align="center">
          You have successfully logged in.
        </Typography>
        <Button variant="contained" color="primary" onClick={handleLogout} style={{ marginBottom: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}>
          Logout
        </Button>
        <Typography variant="h5" gutterBottom align="center">
          An automated day in the life of a modern life insurance Underwriter
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Underwriters
            </Typography>
            <Typography variant="body1">
              A key player in evaluating and assessing the risk associated with an applicant applying for insurance.
              The underwriter holds responsibility for overseeing, interpreting, and sometimes intervening in the automated process to ensure that the final decision is accurate, fair, and compliant.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Context
            </Typography>
            <Typography variant="body1">
              An applicant has a history of Type 2 Diabetes and Obstructive Sleep Apnea (OSA), but they do not remember their A1c level or specific details about their AHI (Apnea-Hypopnea Index) score.
              alitheia needs to verify this information in order to assess the applicant's risk class for the application. The system determines missing information and orders an EHR.
              The EHR provides the missing information. This case is automated.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Key activities
            </Typography>
            <Typography variant="body1">
              Verify EHR data
              <br />
              Understand the rules that were triggered
              <br />
              Review assessment results
            </Typography>
            <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
              Key goals
            </Typography>
            <Typography variant="body1">
              EHRS can assist with automation
              <br />
              Automated decisions can be inspected
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default WelcomePage;