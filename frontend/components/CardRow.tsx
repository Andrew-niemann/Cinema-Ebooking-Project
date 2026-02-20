/* components/CardRow.tsx */
"use client";
import { useState } from "react";
import Card from '@/components/Card';

export default function CardRow() {
    return (
        <div className="m-4">
            <h1 className="text-[#ECDFCC] text-3xl m-2">Horror</h1>
            <div className="flex overflow-hidden">
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
            </div>
        </div>
    )
}