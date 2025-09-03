import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

const UserCountDisplay = ({ userCount }) => {


    return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-sm mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Active Users</h3>
                <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500">Live</span>
                </div>
            </div>

            {/* User Count */}
            <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <div className={`text-3xl font-bold text-gray-900 transition-all duration-300 `}>
                        {userCount.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-500">investors accounts</p>
                </div>
            </div>


        </div>
    );
};

export default UserCountDisplay;