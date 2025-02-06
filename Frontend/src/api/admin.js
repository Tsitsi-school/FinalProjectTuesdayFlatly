import axios from "axios";

import { API_BASE_URL } from '../constants';
const API_DASHBOARD_BASE_URL = API_BASE_URL+"/dashboard";

const DashboardAPI = {
    getStats: async () => {
        try {
            const response = await axios.get(`${API_DASHBOARD_BASE_URL}/stats`);
            return response.data;
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            throw error;
        }
    },

    getRecentActivities: async () => {
        try {
            const response = await axios.get(`${API_DASHBOARD_BASE_URL}/recent-activities`); // Adjust the endpoint as needed
            return response.data;
        } catch (error) {
            console.error("Error fetching recent activities:", error);
            return [];
        }
    },

    getMostActiveUser: async () => {
        try {
            const response = await axios.get(`${API_DASHBOARD_BASE_URL}/most-active-user`); // Adjust the endpoint as needed
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching most active user:", error);
            return null; // Return null to avoid UI crashes
        }
    }
};

export default DashboardAPI;
