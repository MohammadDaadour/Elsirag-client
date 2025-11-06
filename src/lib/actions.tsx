'use client';
import React, { useEffect, useState } from 'react';
import axios from "@/lib/axios";

export async function getMeAction() {
    try {
        const { data } = await axios.get("/auth/me");
        return data;
    } catch (err) {
        console.error("Error fetching user", err);
        return null;
    }
}