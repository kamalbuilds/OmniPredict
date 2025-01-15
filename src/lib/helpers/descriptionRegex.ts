const descriptionRegex = (description: string) => {
  const replacedDescription = description?.replace(/\n\n/g, "\n \n");
  const lines = replacedDescription?.split(/[\r\n]+/);

  const styledLines = lines?.map((line: string) => {
    const words = line.split(/(?=[@#])|\s+/);
    const styledWords = words.map((word) => {
      if (word[0] === "#") {
        return `<em id="hashtags" style="color: #EDC6FF; font-style: normal; word-break: break-all; margin-right: 4px;">${word}</em>`;
      } else if (word[0] === "@") {
        const link = `https://cypher.digitalax.xyz/autograph/${
          word?.includes(".lens")
            ? word?.replace(".lens", "").replace("@", "")
            : word?.replace("@", "")
        }`;
        return ` <a href="${link}" target="_blank" rel="noreferrer" style="word-break: break-all; margin-right: 4px;"> <span style="color: #EDC6FF;">${word}</span> </a> `;
      } else if (
        word.startsWith("http") ||
        word.startsWith("www.") ||
        word.endsWith(".xyz") ||
        word.endsWith(".com")
      ) {
        const url = word?.includes("//") ? word : `//${word}`;
        return ` <a href="${url}" style="word-break: break-all; margin-right: 4px;" target="_blank" rel="noreferrer"> <span style="color: #EDC6FF;">${word}</span> </a> `;
      } else {
        return word;
      }
    });
    return `<span>${styledWords.join(" ")}</span>`;
  });

  const formattedDescription = styledLines.join("<br />");
  return `<div style="word-wrap: break-word; max-width: 100%;">${formattedDescription}</div>`;
};

export default descriptionRegex;
