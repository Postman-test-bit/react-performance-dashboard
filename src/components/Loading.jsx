import { animate } from "animejs";
import { useEffect } from "react";
import PropTypes from "prop-types";

const Loading = ({
  text = "LOADING...",
  color = "#00e5ff",
  size = "2rem",
  spacing = "2px",
  isAnimating = true,
}) => {
  useEffect(() => {
    if (!isAnimating) return;

    const animation = animate(".loading span", {
      y: [
        { to: "-2.75rem", ease: "outExpo", duration: 600 },
        { to: 0, ease: "outBounce", duration: 800, delay: 100 },
      ],
      rotate: {
        from: "-1turn",
        delay: 0,
      },
      delay: (_, i) => i * 50,
      ease: "inOutCirc",
      loopDelay: 1000,
      loop: true,
    });

    return () => {
      animation.pause();
    };
  }, [isAnimating, text]);

  return (
    <div
      className="loading"
      style={{
        textAlign: "center",
        padding: "2rem",
        fontSize: size,
        minHeight: "4rem", // Prevents layout shift when animating
      }}
      aria-live="polite"
      role="status"
    >
      {[...text].map((char, i) => (
        <span
          key={`${char}-${i}`}
          style={{
            display: "inline-block",
            color: color,
            margin: `0 ${spacing}`,
            visibility: isAnimating ? "visible" : "hidden",
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};

Loading.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  spacing: PropTypes.string,
  isAnimating: PropTypes.bool,
};

export default Loading;
