import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/store"
import { useFetchProductsQuery } from "../catolog/catalogApi";
import { currencyFormat } from "../../lib/util";
import { Delete, Edit } from "@mui/icons-material";
import AppPagination from "../../app/shared/components/AppPagination";
import { setPageNumber } from "../catolog/CatalogSlice";
import ProductForm from "./ProductForm";
import { useState } from "react";
import { Product } from "../../app/models/product";
import { useDeleteProductMutation } from "./adminApi";

export default function InventoryPage() {
    const productParams = useAppSelector(state => state.catalog);
    const{data, refetch}= useFetchProductsQuery(productParams);
    const dispatch = useAppDispatch();
    const [editMode, setEditMode] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [deleteproduct] = useDeleteProductMutation();


    const handleSelectProduct = (product: Product) => {
        setSelectedProduct(product);   
        setEditMode(true);
    }

    const handleDeleteProduct = async (id: number) => {
        try {  
            await deleteproduct(id).unwrap();
            refetch();
        } catch (error) {
            console.log(error);
        }
    }

    if (editMode) {
        return <ProductForm 
            setEditMode={setEditMode} 
            product={selectedProduct} 
            refetch={refetch}
            setSelectedProduct={setSelectedProduct}
            />
    }

  return (
    <>
        <Box display='flex'justifyContent='space-between'>
            <Typography sx={{p: 2}} variant='h2'>Inventory</Typography>
            <Button onClick={() => setEditMode(true)} sx={{m:2}} size='large' variant='contained'>Create</Button>
        </Box>
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Product</TableCell>
                            <TableCell align="right">Proce</TableCell>
                            <TableCell align="center">Type</TableCell>
                            <TableCell align="center">Brand</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data && data.items.map(product => (
                            <TableRow
                                key={product.id}
                                sx={{
                                    '&:last-child td, &:last-child th': {border: 0}
                                }}
                            >
                                <TableCell component='th' scope='row'>
                                    {product.id}
                                </TableCell>
                                <TableCell align='left'>
                                    <Box display='flex' alignItems='center'>
                                        <img 
                                            src={product.pictureUrl} 
                                            alt={product.name} 
                                            style={{width: 50, height: 50, marginRight: 10}}/>
                                        {product.name}
                                    </Box>
                                </TableCell>
                                <TableCell align='right'>{currencyFormat(product.price)}</TableCell>
                                <TableCell align='center'>{product.type}</TableCell>
                                <TableCell align='center'>{product.brand}</TableCell>
                                <TableCell align='center'>{product.quantityInStock}</TableCell>
                                <TableCell align='right'>
                                    <Button onClick={() => handleSelectProduct(product)} startIcon={<Edit />}/>
                                    <Button onClick={() => handleDeleteProduct(product.id)} startIcon={<Delete />} color="error" />
                                </TableCell>
                            </TableRow>   
                        ))}
                    </TableBody>
            </Table>
            <Box sx={{p: 3}}>
                {data?.pagination && data.items.length > 0 && (
                    <AppPagination
                        metadata={data.pagination}
                        onPageChange={(page: number) => dispatch(setPageNumber(page))}
                    />
                )}
            </Box>
        </TableContainer>
    </>
  )
}