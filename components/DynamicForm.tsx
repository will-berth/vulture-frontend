"use client"

import { useForm } from "react-hook-form";
import { z, ZodSchema } from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";

interface DynamicFormProps{
    schema: ZodSchema;
    onSubmit: (data: any) => void;
    renderComponent: (form: any) => React.ReactNode;
}

export function DynamicForm({ schema, onSubmit, renderComponent }: DynamicFormProps){
    const form = useForm({
        resolver: zodResolver(schema)
    })
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                {renderComponent(form)}
            </form>
        </Form>
    )
}