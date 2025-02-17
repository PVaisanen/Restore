import { Grid2, Typography } from "@mui/material";
import ProductList from "./ProductList";
import { useFetchFiltersQuery, useFetchProductsQuery } from "./catalogApi";
import Filters from "./Filters";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import AddPagination from "../../app/shared/components/AddPagination";
import { setPageNumber } from "./CatalogSlice";

export default function Catalog() {
  const productParams = useAppSelector(state => state.catalog )
  const {data, isLoading} = useFetchProductsQuery(productParams);
  const {data: filtersData, isLoading: filtersLoading} = useFetchFiltersQuery();
  const dispatch = useAppDispatch();

  if (isLoading || !data || filtersLoading || !filtersData) return <div>Loading...</div>

  return (
    <Grid2 container spacing={4}>
      <Grid2 size={3}>
        <Filters filtersData={filtersData} />
      </Grid2>
      <Grid2 size={9}>
          {data.items && data.items.length > 0 ? (
            <>
            <ProductList products={data.items}/>  
            <AddPagination
                metadata={data.pagination}
                onPageChange={(page: number) => {
                  dispatch(setPageNumber(page))
                  window.scrollTo({top:0, behavior: 'smooth'})
                }}
            />
          </>       
          ) : (
            <Typography variant="h5">The are no results for this filter</Typography>
          )}
          
        
      </Grid2>
    </Grid2>
  )
}