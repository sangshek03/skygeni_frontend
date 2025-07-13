// components/cards/DataCard.tsx
import { Card, CardContent, Typography } from "@mui/material";
import { ReactNode } from "react";

export default function DataCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card className="mb-6 shadow-md rounded-xl">
      <CardContent>
        <Typography variant="h6" className="mb-4 font-semibold">
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
}
