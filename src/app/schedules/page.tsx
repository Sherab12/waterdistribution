"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/navbar";
import mqtt from "mqtt";


export default function SchedulePage() {
    

    return (
        <div className="flex">
            <Navbar activePage="schedules" />
            
        </div>
    );
}
