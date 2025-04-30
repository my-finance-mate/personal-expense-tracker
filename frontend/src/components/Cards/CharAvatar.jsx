import React from "react";
import { getInitials } from "../../utils/helper"; // fixed path

const CharAvatar = ({ fullName, width, height, style }) => {
  return (
    <div className={`${width || 'w-12'} ${height || 'h-12'} ${style ||''}`}>
      {getInitials(fullName || "")}
    </div>
  );
};

export default CharAvatar;
