import React from "react";

interface InfoTooltipProps {
  content?: string;
  children: React.ReactElement;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, children }) => {
  if (!content) return children;

  const childClass = children.props.className || "";
  return React.cloneElement(children, {
    className: `${childClass} info-tooltip`.trim(),
    "data-tooltip": content,
    tabIndex: 0,
  });
};
