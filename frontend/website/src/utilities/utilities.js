export function highlightKeywords(text, keywords) {
  if (!text || !keywords || keywords.length === 0) return [text];

  const regex = new RegExp(`(${keywords.join("|")})`, "g");
  const parts = text.split(regex);

  return parts.map((part) => ({
    text: part,
    isKeyword: keywords.includes(part),
  }));
}

export function highlightLinks(text, placeholders) {
  if (!text || !placeholders) return [{ text }];

  const linkTexts = Object.values(placeholders).map((p) => p.text);
  const regex = new RegExp(`(${linkTexts.join("|")})`, "g");
  const parts = text.split(regex);

  return parts.map((part) => {
    const match = Object.values(placeholders).find((p) => p.text === part);
    if (match) {
      return {
        text: part,
        isLink: true,
        href: match.href,
      };
    }

    return {
      text: part,
      isLink: false,
    };
  });
}
