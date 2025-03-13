import { useState } from "react";

/* Message component
 * Displays a message with subject, message and creation date.
 * Allows expanding/collapsing content and deleting the message.
 */
function Message({ message, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false); // State to track is fully displayed or truncated

  // Format date to display day, month, year, hour and minute of the message
  const formattedDate = new Date(message.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  //Function to set badge color based on department for the message
  const getBadgeColor = (dept) => {
    switch (dept) {
      case "ceo":
        return "bg-purple-100 text-purple-800";
      case "hr":
        return "bg-blue-100 text-blue-800";
      case "board":
        return "bg-green-100 text-green-800";
      case "volunteers":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-gray-900">{message.title}</h3>
          <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>

        <div className="flex space-x-2 mb-2">
          {/* Display department badges using boards instead of recipients */}
          {message.boards &&
            message.boards.map((dept) => (
              <span
                key={dept}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(
                  dept
                )}`}
              >
                {dept}
              </span>
            ))}
        </div>

        <div className="text-gray-700">
          {/* Display full content if expanded, otherwise truncate */}
          {isExpanded
            ? message.content
            : `${message.content.substring(0, 100)}${
                message.content.length > 100 ? "..." : ""
              }`}
        </div>

        <div className="mt-3 flex justify-between items-center">
          {/* Show "Read more" or "Show less" button if content is long */}
          {message.content.length > 100 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {/* Toggle button text based on state */}
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}

          <button
            onClick={() => onDelete(message.id)}
            className="text-sm text-red-600 hover:text-red-800 ml-auto"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default Message;
