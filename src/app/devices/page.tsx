"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Navbar from "../../components/navbar";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";


export default function DevicePage() {
    

    return (
        <div className="flex">
            <Navbar activePage="devices" />

            
        </div>
    );
} 