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
          fontSize: "1.1em",
          fontWeight: "bold",
          lineHeight: "auto",
          margin: "auto",
          "@media(min-width: 780px)": {
            fontSize: "2em",
          },
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          sx={{
            fontSize: "0.8em",
            lineHeight: "auto",
            margin: "auto",
            "@media(min-width: 780px)": {
              fontSize: "1em",
            },
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
};

export default SectionHeader;
