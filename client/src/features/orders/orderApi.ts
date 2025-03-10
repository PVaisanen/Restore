import { createApi } from "@reduxjs/toolkit/query/react";
import { CreateOrder, Order } from "../../app/models/order";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";

export const orderApi = createApi ({
        reducerPath: 'orderApi',
        baseQuery: baseQueryWithErrorHandling,
        endpoints: (builder) => ({
            fetchOrders: builder.query<Order[], void>({
                    query: () => 'orders',
            }),
            fetchOderDetailed: builder.query<Order, number>({
                query: (id) => ({
                    url: `orders/${id}`
                })
            }),
            createOrder: builder.mutation<Order, CreateOrder>({
                query: (order) => ({
                    url: 'orders',
                    method: 'POST',
                    body: order
                })
            })
        })
})

export const {useFetchOrdersQuery, useFetchOderDetailedQuery, useCreateOrderMutation} 
= orderApi;