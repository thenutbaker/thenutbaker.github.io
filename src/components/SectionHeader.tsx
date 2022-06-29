import { Paper, Typography } from "@mui/material";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  extraMarginTop?: boolean;
};
const SectionHeader = (props: SectionHeaderProps) => {
  const { title, subtitle, extraMarginTop = true } = props;
  return (
    <Paper
      sx={{
        gridColumnStart: "2",
        marginTop: extraMarginTop ? "4em" : "1em",
        padding: "1em",
        maxHeight: "fit-content",
        backgroundColor: "#F5D998",
        display: "flex",
        flexDirection: "column",
      }}
      elevation={3}
    >
      <Typography
        sx={{
          fontSize: "2em",
          fontWeight: "bold",
          lineHeight: "auto",
          margin: "auto",
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          sx={{
            fontSize: "1em",
            lineHeight: "auto",
            margin: "auto",
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
};

export default SectionHeader;
