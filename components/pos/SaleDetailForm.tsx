"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";

const formSaleDetail = z.object({
    products: z.array(
        z.object({
            product_id: z.number(),
            quantity: z.number(),
        })
    )
});

export function SaleDetailForm(){
    const form = useForm<z.infer<typeof formSaleDetail>>({
        // resolver: zodResolver(formSaleDetail),
        defaultValues: {
          products: [],
        },
    })
    
    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSaleDetail>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>

            </form>
        </Form>
    )
}