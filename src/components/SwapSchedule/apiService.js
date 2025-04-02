const BASE_URL = "https://vietsac.id.vn/api";

// Fetch the employee's shifts
export const fetchMyShifts = async (staffId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/staff-zone-schedules?StaffId=${staffId}&IncludeProperties=WorkingSlot`
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error) {
        throw new Error(
          errorData.error.message || `API error: ${response.status}`
        );
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch shifts");
    }

    return data.result.items;
  } catch (error) {
    console.error("Error fetching shifts:", error);
    throw error;
  }
};

// Fetch available shifts for a specific date
export const fetchAvailableShifts = async (workingDate) => {
  try {
    const response = await fetch(
      `${BASE_URL}/staff-zone-schedules?WorkingDate=${workingDate}&IncludeProperties=WorkingSlot`
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error) {
        throw new Error(
          errorData.error.message || `API error: ${response.status}`
        );
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch available shifts");
    }

    return data.result.items;
  } catch (error) {
    console.error("Error fetching available shifts:", error);
    throw error;
  }
};

// Submit a shift swap request
export const submitShiftSwap = async (swapData) => {
  try {
    const response = await fetch(`${BASE_URL}/swap-working-slots`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(swapData),
    });

    // Handle error response
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error) {
        throw new Error(
          errorData.error.message || `API error: ${response.status}`
        );
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to submit shift swap request");
    }

    return data;
  } catch (error) {
    console.error("Error submitting shift swap:", error);
    throw error;
  }
};

// Fetch system configurations
export const fetchConfigs = async () => {
  try {
    const response = await fetch(`${BASE_URL}/configs`);

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error) {
        throw new Error(
          errorData.error.message || `API error: ${response.status}`
        );
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch configurations");
    }

    // Convert the items array to an object with key-value pairs for easier access
    const configsObject = {};
    data.result.items.forEach((item) => {
      configsObject[item.key] = item.value;
    });

    return configsObject;
  } catch (error) {
    console.error("Error fetching configurations:", error);
    throw error;
  }
};

// Fetch swap requests sent by the employee
export const fetchSentSwapRequests = async (staffId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/swap-working-slots?EmployeeFromId=${staffId}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error) {
        throw new Error(
          errorData.error.message || `API error: ${response.status}`
        );
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch sent swap requests");
    }

    return data.result.items;
  } catch (error) {
    console.error("Error fetching sent swap requests:", error);
    throw error;
  }
};

// Fetch swap requests received by the employee
export const fetchReceivedSwapRequests = async (staffId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/swap-working-slots?EmployeeToId=${staffId}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error) {
        throw new Error(
          errorData.error.message || `API error: ${response.status}`
        );
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch received swap requests");
    }

    return data.result.items;
  } catch (error) {
    console.error("Error fetching received swap requests:", error);
    throw error;
  }
};

// Fetch working slot details
export const fetchWorkingSlotDetails = async (workingSlotId) => {
  try {
    const response = await fetch(`${BASE_URL}/working-slots/${workingSlotId}`);

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error) {
        throw new Error(
          errorData.error.message || `API error: ${response.status}`
        );
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch working slot details");
    }

    return data.result;
  } catch (error) {
    console.error("Error fetching working slot details:", error);
    throw error;
  }
};

// Approve a swap request
export const approveSwapRequest = async (requestId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/swap-working-slots/pending-approved/${requestId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error) {
        throw new Error(
          errorData.error.message || `API error: ${response.status}`
        );
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to approve swap request");
    }

    return data;
  } catch (error) {
    console.error("Error approving swap request:", error);
    throw error;
  }
};

// Reject a swap request
export const rejectSwapRequest = async (requestId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/swap-working-slots/rejected/${requestId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error) {
        throw new Error(
          errorData.error.message || `API error: ${response.status}`
        );
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to reject swap request");
    }

    return data;
  } catch (error) {
    console.error("Error rejecting swap request:", error);
    throw error;
  }
};
