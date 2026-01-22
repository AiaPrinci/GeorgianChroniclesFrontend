const isGeorgian = (text) => /[\u10A0-\u10FF]/.test(text);

export default function AutoFontText({ text, classN }) {
  return (
    <span>
      {text.split(/(\s+)/).map((part, i) => {
        if (part.trim() === "") return part;

        const className = isGeorgian(part) ? "font_ka" : "font_en";

        return (
          <span key={i} className={className + " " + classN}>
            {part}
          </span>
        );
      })}
    </span>
  );
};