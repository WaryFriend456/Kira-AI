'use client'

import React from "react"
import { Button } from "./ui/button"
import { getAurinkoAuthUrl } from "@/lib/aurinko"

export default function LinkAccountButton() {
    return (
        <Button onClick={async () => {
            const authUrl = await getAurinkoAuthUrl('Google');
            window.location.href = authUrl;
        }}>
            Link Account 
        </Button>
    )
}