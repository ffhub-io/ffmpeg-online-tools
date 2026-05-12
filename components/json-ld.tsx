// Inline JSON-LD. Use `dangerouslySetInnerHTML` because React escapes < > in
// text nodes, which would break the script tag's JSON parser.

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
