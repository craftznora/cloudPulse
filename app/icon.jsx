import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          background: "linear-gradient(135deg, #3d5ac8, #6366f1)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: 8,
          fontFamily: "sans-serif",
        }}
      >
        CP
      </div>
    ),
    {
      ...size,
    }
  );
}
