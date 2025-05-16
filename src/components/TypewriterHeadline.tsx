
import { useState, useEffect, useRef } from "react";

const professionalTypes = ["Financial Professional", "Accountant", "Financial Advisor", "Fractional CFO"];

export default function TypewriterHeadline() {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentWord = professionalTypes[currentIndex];

    // Handle the typing/deleting effect
    const handleTyping = () => {
      // If we're deleting
      if (isDeleting) {
        // Remove a character
        setDisplayText((prev) => prev.substring(0, prev.length - 1));
        setTypingSpeed(50); // Faster when deleting

        // If we've deleted everything, start typing the next word
        if (displayText === "") {
          setIsDeleting(false);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % professionalTypes.length);
          setTypingSpeed(150); // Normal speed for typing
        }
      }
      // If we're typing
      else {
        // Add a character
        setDisplayText(currentWord.substring(0, displayText.length + 1));

        // If we've typed the whole word, pause then start deleting
        if (displayText === currentWord) {
          // Pause at the end of the word before deleting
          setTypingSpeed(2000); // Longer pause at complete word
          setIsDeleting(true);
        }
      }
    };

    // Set up the timeout for the next character
    timeoutRef.current = setTimeout(handleTyping, typingSpeed);

    // Clean up the timeout when the component unmounts or when dependencies change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [displayText, isDeleting, currentIndex, typingSpeed]);

  return (
    <span className="block text-brand-teal min-h-[60px]">
      {displayText}
      <span className="inline-block w-1 h-6 ml-1 bg-brand-teal animate-pulse"></span>
    </span>
  );
}
