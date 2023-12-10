"use client";
import { search } from "@/services/metaServices";
import React, { useState } from "react";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    // Set loading to true while waiting for the API response
    setLoading(true);

    try {
      const data = await search(searchQuery);

      // Update state with the search results
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      // Set loading back to false after the API response is received
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>Search Page</h1>
      <div>
        <input
          type="text"
          placeholder="Enter your search query"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          Search
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {searchResults.length > 0 && (
        <div>
          <h2 style={{ marginTop: "20px" }}>Search Results:</h2>
          <ul>
            {searchResults.map((result) => (
              <></>
              //   <li key={result.id}>{result.name}</li>
              // Adjust the key and data properties based on your API response structure
            ))}
          </ul>
        </div>
      )}
      {searchResults.length === 0 && !loading && <p>No results found.</p>}
    </div>
  );
};

export default SearchPage;
