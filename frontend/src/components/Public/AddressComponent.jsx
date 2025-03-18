import React from "react";

function AddressComponent({ address }) {
  return (
    <div>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          address
        )}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {address}
      </a>
    </div>
  );
}
export default AddressComponent;
