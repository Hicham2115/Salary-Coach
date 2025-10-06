import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  IconButton,
  Typography,
  Box,
  Button,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import icon1 from "../assets/icon1.jpg";
import icon2 from "../assets/icon2.jpg";
import icon3 from "../assets/icon3.jpg";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function LandingPage2() {
  const navigate = useNavigate();

  function HandelLogin() {
    navigate("/SignUp");
  }

  const cards = [
    {
      icon: icon1,
      name: "Sarah Johnson",
      title: "Small Business Owner",
      message:
        "Welth has transformed how I manage my business finances. The AI insights have helped me identify cost-saving opportunities I never knew existed.",
    },
    {
      icon: icon2,
      name: "Michael Chen",
      title: "Freelancer",
      message:
        "The receipt scanning feature saves me hours each month. Now I can focus on my work instead of manual data entry and expense tracking.",
    },
    {
      icon: icon3,
      name: "Sarah Johnson",
      title: "Small Business Owner",
      message:
        "Welth has transformed how I manage my business finances. The AI insights have helped me identify cost-saving opportunities I never knew existed.",
    },
  ];

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: 4,
          mt: 10,
          flexWrap: "wrap",
        }}
      >
        {cards.map((card, index) => (
          <Card key={index} sx={{ maxWidth: 345, boxShadow: 3 }}>
            <CardHeader
              avatar={
                <Avatar
                  sx={{
                    width: 50,
                    height: 50,
                    overflow: "hidden",
                  }}
                  aria-label="profile"
                >
                  <img
                    src={card.icon}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Avatar>
              }
              title={card.name}
              titleTypographyProps={{
                sx: {
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                },
              }}
              subheader={card.title}
            />
            <CardContent>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {card.message}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
      <Box
        sx={{
          backgroundColor: "#2664eb",
          mt: 10,
          color: "white",
          width: "100%",
          borderRadius: 2,
          py: 10,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
          Ready to Take Control of Your Finances?
        </Typography>
        <Typography variant="h7" sx={{ fontFamily: "" }}>
          Join thousands of users who are already managing their finances
          smarter with Welth
        </Typography>
        <br />

        <Button
          onClick={HandelLogin}
          variant="contained"
          sx={{
            mt: 4,
            backgroundColor: "white",
            color: "#2664eb",
            fontWeight: "bold",
            animation: "moveUpDown 1s ease-in-out infinite",
            "@keyframes moveUpDown": {
              "0%": { transform: "translateY(0)" },
              "50%": { transform: "translateY(-10px)" },
              "100%": { transform: "translateY(0)" },
            },
          }}
        >
          Start Free Trial
        </Button>
      </Box>
      <Typography align="center" sx={{ fontWeight: "bold", mt: 3 }}>
        Made By Hicham Kamani
      </Typography>
      <FavoriteIcon
        sx={{ fontWeight: "bold", display: "flex", justifySelf: "center" }}
      />
    </>
  );
}
