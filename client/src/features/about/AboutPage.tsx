import { Alert, AlertTitle, Button, ButtonGroup, Container, Divider, List, ListItem, Typography } from "@mui/material";
import { useLazyGet400ErrorQuery, useLazyGet401ErrorQuery, useLazyGet404ErrorQuery, useLazyGet500ErrorQuery, useLazyGetValidationErrorQuery } from "./errorApi";
import { useState } from "react";
import MovingBox from "../../app/shared/components/MovingBox";

export default function AboutPage() {
  const [validationErrors, setvalidationErrors] = useState<string[]>([]);
  const [trigger400Error] = useLazyGet400ErrorQuery();
  const [trigger401Error] = useLazyGet401ErrorQuery();
  const [trigger404Error] = useLazyGet404ErrorQuery();
  const [trigger500Error] = useLazyGet500ErrorQuery();
  const [triggerValidationError] = useLazyGetValidationErrorQuery();

  const getValidationError = async () => {
    try {
      await triggerValidationError().unwrap();
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error 
        && typeof (error as {message: unknown}).message === 'string' ) {
          const errorArray = (error as  {message: string}).message.split(',');
          setvalidationErrors(errorArray);
      }
    }
  }

  return (
    <Container>

      <Typography variant="h3" sx={{mb: 1}} textAlign='center'>
        Modern webshop   
      </Typography>
      <Typography variant="h6" sx={{mb: 3}} textAlign='center'>
        We promise to delivery your order fast and reliably. 
      </Typography>

      <Divider />

      <MovingBox></MovingBox>

      <Divider />




      <Typography gutterBottom variant="h5" sx={{mt: 5}}>Error for testing</Typography>
      <ButtonGroup>
        <Button variant="contained" onClick={() => trigger400Error()
            .catch(err => console.log(err))}>
          Test 400 Error</Button>

          <Button variant="contained" onClick={() => trigger401Error()
            .catch(err => console.log(err))}>
          Test 401 Error</Button>

          <Button variant="contained" onClick={() => trigger404Error()
            .catch(err => console.log(err))}>
          Test 404 Error</Button>

          <Button variant="contained" onClick={() => trigger500Error()
            .catch(err => console.log(err))}>
          Test 500 Error</Button>

          <Button variant="contained" onClick={getValidationError}>
            
          Test validation Error</Button>
      </ButtonGroup>
      {validationErrors.length > 0 && (
        <Alert severity="error">
            <AlertTitle>Validation errors</AlertTitle>
            <List>
              {validationErrors.map(err => (
                  <ListItem key={err}>{err}</ListItem>
              ))}
            </List>
        </Alert>
      )}
    </Container>
  )
}