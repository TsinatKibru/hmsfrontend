import React, { useState, useEffect } from "react";

const GrantedDeniedRequestsComponent = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch the list of requests from the database
    // Replace this with your own database fetch logic
    const fetchedRequests = fetchRequestsFromDatabase();
    setRequests(fetchedRequests);
  }, []);

  const fetchRequestsFromDatabase = () => {
    // Replace this with your own logic to fetch the requests from the database
    // Return a dummy array of requests for demonstration purposes
    return [
      { id: 1, item: "Item 1", quantity: 10, status: "granted" },
      { id: 2, item: "Item 2", quantity: 5, status: "denied" },
      { id: 3, item: "Item 3", quantity: 2, status: "granted" },
    ];
  };

  const handleApprove = (id) => {
    // Update the status of the request to 'approved' in the database
    // Replace this with your own logic to update the request status
    const updatedRequests = requests.map((request) => {
      if (request.id === id) {
        return { ...request, status: "approved" };
      }
      return request;
    });
    setRequests(updatedRequests);
  };

  const handleApproveAll = () => {
    // Update the status of all granted requests to 'approved' in the database
    // Replace this with your own logic to update the request status for all granted requests
    const updatedRequests = requests.map((request) => {
      if (request.status === "granted") {
        return { ...request, status: "approved" };
      }
      return request;
    });
    setRequests(updatedRequests);
  };

  return (
    <div className="flex flex-col justify-items-center p-4 mb-20 ml-14 mr-2 overflow-x-hidden flex-grow">
      <h2 className="text-2xl font-bold mb-4">Granted/Denied Requests</h2>
      {requests.length > 0 ? (
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">Item</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-b border-gray-200">
                <td className="px-4 py-2">{request.item}</td>
                <td className="px-4 py-2">{request.quantity}</td>
                <td className="px-4 py-2">{request.status}</td>
                {request.status === "granted" && (
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                      Approve
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No requests found.</p>
      )}
      {requests.some((request) => request.status === "granted") && (
        <button
          onClick={handleApproveAll}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mt-4">
          Approve All
        </button>
      )}
    </div>
  );
};

export default GrantedDeniedRequestsComponent;
