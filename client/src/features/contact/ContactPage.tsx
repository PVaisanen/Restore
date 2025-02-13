import { useDispatch } from "react-redux"
import { decrement, increment } from "./counterReducer";
import { Button, ButtonGroup, Divider, Typography } from "@mui/material";
import { useAppSelector } from "../../app/store/store";

export default function ContactPage() {
  const {data} = useAppSelector(state => state.counter);
  const dispatch = useDispatch();
  return (
    <>
      <Typography variant="h2">
        Contact page
      </Typography>
      <Typography variant="body1" sx={{mb: 1, mt:3}}>
        Billing
      </Typography>
      <Typography variant="body2" sx={{mb: 3, ml:3}}>
        billing@estore.fi
      </Typography>

      <Typography variant="body1" sx={{mb: 1, mt:3}}>
        Support and other topics
      </Typography>
      <Typography variant="body2" sx={{mb: 3, ml:3}}>
        info@estore.fi 
      </Typography>
      
      <Typography variant="body1" sx={{mb: 1, mt:3}}>
        Address
      </Typography>
      <Typography variant="body2" sx={{mb: 3, ml:3}}>
        E-Street 25, Helsinki Finland
      </Typography>

      <Divider />
      <Typography variant="body1" sx={{mt: 5}}>
        The data is: {data}
      </Typography>
      <ButtonGroup>
          <Button onClick={() => dispatch(decrement(1))} color="error">Decrement</Button>
          <Button onClick={() => dispatch(increment(1))} color="secondary">Increment</Button>
          <Button onClick={() => dispatch(increment(5))} color="primary">Increment by 5</Button>
      </ButtonGroup>
    </>
  )
}