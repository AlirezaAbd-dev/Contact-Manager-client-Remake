"use client";
import Grid from "@mui/material/Unstable_Grid2";
import Skeleton from "@mui/material/Skeleton";
import Image from "next/image";
import Avatar from "@mui/material/Avatar"

const EditContactAvatar = ({avatarSrc, alt}) => {
    const skeleton = (
        <Skeleton
            variant="circular"
            animation="wave"
            sx={{
                width: {
                    xs: 150,
                    sm: 200,
                    md: 250,
                },
                height: {
                    xs: 150,
                    sm: 200,
                    md: 250,
                },
                m: "0 auto",
            }}
        />
    );

    return (
        <Grid xs={12} sm={12} md={4} lg={4} p={1}>
            {!avatarSrc ? skeleton : (
                <Avatar
                    variant="circular"
                    sx={{
                        width: {
                            xs: "70%",
                            sm: "70%",
                            md: "100%",
                        },
                        height: "auto",
                        m: "0 auto",
                    }}
                >
                    <Image
                        priority
                        src={avatarSrc}
                        alt={alt}
                        width={500}
                        height={500}
                        style={{
                            width: "100%",
                            height: 'auto',
                            objectFit: 'fill'
                        }}
                    />
                </Avatar>
            )}
        </Grid>
    );
};

export default EditContactAvatar;
