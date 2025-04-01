const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getToken = () => sessionStorage.getItem("idToken");

const request = async (method, endpoint, data = null) => {
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`
  };

  const config = {
    method,
    headers,
  };

  if (data && method !== "GET") {
    config.body = JSON.stringify(data);
  }

  const url = method === "GET" && data
    ? `${BASE_URL}${endpoint}?${new URLSearchParams(data)}`
    : `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.message || "API request failed");
    }
    return json;
  } catch (error) {
    console.error(`[API ${method}] ${endpoint} -`, error.message);
    throw error;
  }
};

export const api = {
  get: (endpoint, params) => request("GET", endpoint, params),
  post: (endpoint, data) => request("POST", endpoint, data),
  put: (endpoint, data) => request("PUT", endpoint, data),
  del: (endpoint, data) => request("DELETE", endpoint, data),
};
