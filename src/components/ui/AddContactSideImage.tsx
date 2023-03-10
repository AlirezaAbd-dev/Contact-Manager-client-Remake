"use client";
import { useEffect, useState } from "react";
import { Slide } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Image from "next/image";

import thinkingManImage from "../../assets/man-taking-note.png";

const AddContactSideImage = () => {
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    setImageLoading(true);

    return () => {
      setImageLoading(false);
    };
  }, []);
  return (
    <Slide
      direction="right"
      in={imageLoading}
      style={{
        transitionDelay: imageLoading ? "400ms" : "0ms",
      }}
    >
      <Grid xs={12} sm={12} md={5}>
        <Image
          src={thinkingManImage}
          alt="Man taking note"
          height={600}
          width={1000}
          priority
          style={{
            width: "100%",
            height: "auto",
            opacity: 0.5,
          }}
        />
      </Grid>
    </Slide>
  );
};

export default AddContactSideImage;
