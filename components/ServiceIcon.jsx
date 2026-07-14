/** Small inline SVG icon set for AWS services and concepts. */

const paths = {
  browser: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9 H21" />
      <circle cx="6" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  hosting: (
    <>
      <path d="M7 17 A4.5 4.5 0 0 1 7 8 A5.5 5.5 0 0 1 17.5 9.5 A4 4 0 0 1 17 17 Z" />
      <path d="M9.5 13.5 L12 11 L14.5 13.5" />
      <path d="M12 11 V17" />
    </>
  ),
  gateway: (
    <>
      <path d="M12 3 L20 7.5 V16.5 L12 21 L4 16.5 V7.5 Z" />
      <path d="M8.5 12 H15.5" />
      <path d="M13 9.5 L15.5 12 L13 14.5" />
    </>
  ),
  lambda: (
    <>
      <path d="M6 20 L10.2 4 H12.8 L18 20" />
      <path d="M8.8 14 H15.2" />
    </>
  ),
  dynamodb: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="2.8" />
      <path d="M5 6 V18 C5 19.5 8.1 21 12 21 C15.9 21 19 19.5 19 18 V6" />
      <path d="M5 12 C5 13.5 8.1 15 12 15 C15.9 15 19 13.5 19 12" />
    </>
  ),
  s3: (
    <>
      <path d="M5 5 L19 5 L17.5 19 C17.4 20.1 15 21 12 21 C9 21 6.6 20.1 6.5 19 Z" />
      <ellipse cx="12" cy="5" rx="7" ry="2" />
      <circle cx="12" cy="13" r="2.2" />
    </>
  ),
  comprehend: (
    <>
      <circle cx="10" cy="10" r="6" />
      <path d="M14.5 14.5 L20 20" />
      <path d="M7.5 10 C8.3 8.6 11.7 8.6 12.5 10" />
    </>
  ),
  cognito: (
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20 C5 16.5 8 14.5 12 14.5 C16 14.5 19 16.5 19 20" />
    </>
  ),
  cloudwatch: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7 V12 L15.5 14" />
    </>
  ),
  zap: <path d="M13 2 L5 13 H11 L9.5 22 L19 9 H13 Z" />,
  shield: <path d="M12 3 L19 6 V11 C19 16.2 16.1 19.6 12 21 C7.9 19.6 5 16.2 5 11 V6 Z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12 H20.5" />
      <ellipse cx="12" cy="12" rx="3.8" ry="8.5" />
    </>
  ),
};

export default function ServiceIcon({ name, size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name] ?? paths.globe}
    </svg>
  );
}
