import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function KioskConfirmation({ booking, onNextDriver }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
        >
            <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl p-8 max-w-lg text-center mx-auto">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-slate-900">Arrival Confirmed</h2>
                <p className="text-slate-600 mt-2 text-lg">
                    You have successfully checked in. Please proceed to your assigned dock.
                </p>
                <div className="mt-6 text-left bg-slate-100 p-6 rounded-lg text-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-slate-700">Assigned Dock:</span>
                        <span className="font-bold text-blue-700 text-2xl">{booking.dock_name}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-700">Reference #:</span>
                        <span className="font-mono text-slate-800">{booking.reference_number}</span>
                    </div>
                </div>
                <Button onClick={onNextDriver} size="lg" className="mt-8 w-full text-lg py-7">
                    Next Driver <ArrowRight className="ml-2 w-5 h-5"/>
                </Button>
            </div>
        </motion.div>
    );
}