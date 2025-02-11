import { Box, Divider, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { ConfirmationToken } from "@stripe/stripe-js";
import { useBasket } from "../../lib/hooks/useBasket";
import { currencyFormat } from "../../lib/util";

type Props = {
    confirmationToken: ConfirmationToken | null;
}
export default function Review({confirmationToken}: Props) {
    const { basket } = useBasket();
    
    const addressString = () => {
        if (!confirmationToken?.shipping) return '';
        const {name, address} = confirmationToken.shipping;
        return `${name}, ${address?.line1}, ${address?.line2}, ${address?.city}, ${address?.state},
                ${address?.postal_code}, ${address?.country} `
    }

    const paymentString = () => {
        if (!confirmationToken?.payment_method_preview.card) return '';
        const {card} = confirmationToken.payment_method_preview;

        return `${card.brand.toLocaleUpperCase()}, **** **** **** ${card.last4}, 
            Exp ${card.exp_month}/${card.exp_year}`
    }

    const ConfirmationEmailString = () => {
        if(!confirmationToken?.payment_method_preview.billing_details.email && 
            !confirmationToken?.payment_method_preview.billing_details.phone) return '-';
        const {billing_details} = confirmationToken.payment_method_preview;

        return `Email: ${billing_details.email}, Mob: ${billing_details.phone}`
    }

    return (
        <div>
            <Box mt={4} width='100%'>
                <Typography>
                        Billin and delivery information     
                </Typography>
                <dl>
                    <Typography component='dt' fontSize='medium'>
                        Shipping adddress
                    </Typography>
                    <Typography component='dd' mt={1} color='textSecondary'>
                            {addressString()}
                    </Typography>
                    <Typography component='dt' fontSize='medium'>
                        Payment details
                    </Typography>
                    <Typography component='dd'  mt={1} color='textSecondary'>
                            {paymentString()}
                    </Typography>
                    <Typography component='dt' fontSize='medium'>
                        Order confirmation details
                    </Typography>
                    <Typography component='dd'  mt={1} color='textSecondary'>
                            {ConfirmationEmailString()}
                    </Typography>
                </dl>
            </Box>
            <Box mt={6} mx='auto'>
                <Divider />
                <TableContainer>
                    <Table>
                        <TableBody>
                            {basket?.items.map((item) => (
                                <TableRow key={item.productId} 
                                    sx={{borderBottom: '1px solid rgba(224, 224, 224, 1)'}}>
                                    <TableCell sx={{py: 4}}>
                                        <Box display='flex' alignItems='center' gap={3}>
                                            <img src={item.pictureUrl} 
                                                alt={item.name} 
                                                style={{width: 40, height: 40}} 
                                            />
                                            <Typography>{item.name}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center" sx={{p: 4}}>
                                       x {item.quantity}
                                    </TableCell>
                                    <TableCell align="right" sx={{p: 4}}>
                                       {currencyFormat(item.price)}
                                    </TableCell>
                                </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

        </div>
    )
}