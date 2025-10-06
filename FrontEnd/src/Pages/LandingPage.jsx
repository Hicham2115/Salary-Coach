import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Logo from "../assets/Blue Geometric Minimalist Finance Logo.png";
import banner from "../assets/image.jpg";
import StackedBarChartIcon from "@mui/icons-material/StackedBarChart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LanguageIcon from "@mui/icons-material/Language";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import React from "react";
import { SignInButton } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { UserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";

function LandingPage() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isSignedIn) {
      navigate("/dashboard");
    }
  }, [isSignedIn, navigate]);

  function HandelLogin() {
    navigate("/SignUp");
  }

  return (
    <>
      {/* Sticky Navbar */}
      <Box
        sx={{
          flexGrow: 1,
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <AppBar
          position="static"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(10px)",
            boxShadow: "none",
            color: "black",
            height: "110px",
          }}
        >
          <Toolbar sx={{ display: "flex", px: 2 }}>
            {/* Left: Logo */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <img src={Logo} alt="SalaryCoach logo" width={200} />
            </Box>

            {/* Center: Nav Items */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mx: 2,
                  fontSize: "medium",
                  color: "text.secondary",
                  cursor: "pointer",
                }}
              >
                Features
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mx: 2,
                  fontSize: "medium",
                  color: "text.secondary",
                  cursor: "pointer",
                }}
              >
                Testimonials
              </Typography>
            </Box>

            {/* Right: Login Button */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              {isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <Button variant="contained" onClick={HandelLogin}>
                  Get Started
                </Button>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        {/* Divider line */}
        <Divider
          sx={{
            border: "none",
            height: "1px",
            bgcolor: "#E0E0E0", // light gray, change as you like
          }}
        />
      </Box>

      {/* Main Heading with Gradient */}
      <Typography
        variant="h2"
        align="center"
        sx={{
          fontWeight: "bold",
          fontSize: { xs: "50px", sm: "80px", md: "100px" },
          my: 4,
          background: "linear-gradient(to right, #125a9c, #1975d1)", // darker to #1975d1
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Manage Your Finances with Intelligence
      </Typography>

      {/* Subheading */}
      <Typography
        variant="h6"
        align="center"
        sx={{
          width: { xs: "90%", sm: "70%", md: "50%" },
          mx: "auto",
        }}
      >
        An AI-powered financial management platform that helps you track,
        analyze, and optimize your spending with real-time insights.
      </Typography>

      {/* CTA Button */}
      <Box align="center" sx={{ mt: 3 }}>
        <Button variant="contained" size="large" onClick={HandelLogin}>
          Get Started
        </Button>
      </Box>

      {/* Banner Image */}
      <img
        src={banner}
        alt="banner"
        width="100%"
        style={{
          marginTop: "40px",
          boxShadow: "2px -3px 20px -10px rgba(0,0,0,0.75)",
        }}
      />

      {/* Statistics*/}
      <Box
        sx={{
          backgroundColor: "#f0f6ff",
          display: "flex",
          gap: "205px",
          justifyContent: "center",
          marginTop: "20px",
          padding: 10,
          color: "#2664eb",
          height: "70px",
        }}
      >
        <Typography sx={{ fontSize: "40px", fontWeight: "bold" }}>
          50K+
        </Typography>
        <Typography sx={{ fontSize: "40px", fontWeight: "bold" }}>
          $2B+
        </Typography>
        <Typography sx={{ fontSize: "40px", fontWeight: "bold" }}>
          99.9%
        </Typography>
        <Typography sx={{ fontSize: "40px", fontWeight: "bold" }}>
          4.9/5
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: "210px",
          justifyContent: "center",
          color: "#2664eb",
          marginTop: "-90px",
        }}
      >
        <Typography sx={{ color: "text.secondary" }}>Active Users</Typography>
        <Typography sx={{ color: "text.secondary" }}>
          Transactions Tracked
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>Uptime</Typography>
        <Typography sx={{ color: "text.secondary" }}>User Rating</Typography>
      </Box>

      <Typography
        align="center"
        variant="h4"
        sx={{ color: "black", marginTop: "130px", fontWeight: "bold" }}
      >
        Everything you need to manage your finances
      </Typography>

      {/* Cards */}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
          marginTop: "50px",
        }}
      >
        <Box
          sx={{
            width: "30%",
            height: "280px",
            boxShadow: "2px -3px 20px -10px rgba(0,0,0,0.75)",
            borderRadius: "10px",
            marginTop: "50px",
            width: { xs: "90%", sm: "45%", md: "30%" },
          }}
        >
          <StackedBarChartIcon
            color="primary"
            sx={{
              p: 5,
              fontSize: "50px",
              display: "flex",
              justifySelf: "start",
            }}
          />
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", paddingLeft: "40px", marginTop: "-20px" }}
          >
            Advanced Analytics
          </Typography>
          <Typography
            sx={{
              paddingLeft: "40px",
              marginTop: "10px",
              fontSize: "18px",
              color: "text.secondary",
              width: "80%",
            }}
          >
            Get detailed insights into your spending patterns with AI-powered
            analytics
          </Typography>
        </Box>

        {/* Card 2 */}
        <Box
          sx={{
            width: "30%",
            height: "280px",
            boxShadow: "2px -3px 20px -10px rgba(0,0,0,0.75)",
            borderRadius: "10px",
            marginTop: "50px",
            width: { xs: "90%", sm: "45%", md: "30%" },
          }}
        >
          <AttachMoneyIcon
            color="primary"
            sx={{
              p: 5,
              fontSize: "50px",
              display: "flex",
              justifySelf: "start",
            }}
          />
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", paddingLeft: "40px", marginTop: "-20px" }}
          >
            Smart Receipt Scanner
          </Typography>
          <Typography
            sx={{
              paddingLeft: "40px",
              marginTop: "10px",
              fontSize: "18px",
              color: "text.secondary",
              width: "80%",
            }}
          >
            Extract data automatically from receipts using advanced AI
            technology
          </Typography>
        </Box>

        {/* Card 3*/}
        <Box
          sx={{
            width: "30%",
            height: "280px",
            boxShadow: "2px -3px 20px -10px rgba(0,0,0,0.75)",
            borderRadius: "10px",
            marginTop: "50px",
            width: { xs: "90%", sm: "45%", md: "30%" },
          }}
        >
          <AvTimerIcon
            color="primary"
            sx={{
              p: 5,
              fontSize: "50px",
              display: "flex",
              justifySelf: "start",
            }}
          />
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", paddingLeft: "40px", marginTop: "-20px" }}
          >
            Budget Planning
          </Typography>
          <Typography
            sx={{
              paddingLeft: "40px",
              marginTop: "10px",
              fontSize: "18px",
              color: "text.secondary",
              width: "80%",
            }}
          >
            Create and manage budgets with intelligent recommendations
          </Typography>
        </Box>

        {/* Card 4*/}
        <Box
          sx={{
            width: "30%",
            height: "280px",
            boxShadow: "2px -3px 20px -10px rgba(0,0,0,0.75)",
            borderRadius: "10px",
            marginTop: "50px",
            width: { xs: "90%", sm: "45%", md: "30%" },
          }}
        >
          <AccountBalanceWalletIcon
            color="primary"
            sx={{
              p: 5,
              fontSize: "50px",
              display: "flex",
              justifySelf: "start",
            }}
          />
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", paddingLeft: "40px", marginTop: "-20px" }}
          >
            Multi-Account Support
          </Typography>
          <Typography
            sx={{
              paddingLeft: "40px",
              marginTop: "10px",
              fontSize: "18px",
              color: "text.secondary",
              width: "80%",
            }}
          >
            Manage multiple accounts and credit cards in one place
          </Typography>
        </Box>
        {/* Card 5 */}
        <Box
          sx={{
            width: "30%",
            height: "280px",
            boxShadow: "2px -3px 20px -10px rgba(0,0,0,0.75)",
            borderRadius: "10px",
            marginTop: "50px",
            width: { xs: "90%", sm: "45%", md: "30%" },
          }}
        >
          <LanguageIcon
            color="primary"
            sx={{
              p: 5,
              fontSize: "50px",
              display: "flex",
              justifySelf: "start",
            }}
          />
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", paddingLeft: "40px", marginTop: "-20px" }}
          >
            Multi-Currency
          </Typography>
          <Typography
            sx={{
              paddingLeft: "40px",
              marginTop: "10px",
              fontSize: "18px",
              color: "text.secondary",
              width: "80%",
            }}
          >
            Support for multiple currencies with real-time conversion
          </Typography>
        </Box>

        {/* Card 6 */}
        <Box
          sx={{
            width: "30%",
            height: "280px",
            boxShadow: "2px -3px 20px -10px rgba(0,0,0,0.75)",
            borderRadius: "10px",
            marginTop: "50px",
            width: { xs: "90%", sm: "45%", md: "30%" },
          }}
        >
          <ElectricBoltIcon
            color="primary"
            sx={{
              p: 5,
              fontSize: "50px",
              display: "flex",
              justifySelf: "start",
            }}
          />
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", paddingLeft: "40px", marginTop: "-20px" }}
          >
            Automated Insights
          </Typography>
          <Typography
            sx={{
              paddingLeft: "40px",
              marginTop: "10px",
              fontSize: "18px",
              color: "text.secondary",
              width: "80%",
            }}
          >
            Get automated financial insights and recommendations
          </Typography>
        </Box>
      </Box>

      {/*How It Works*/}

      <Box
        sx={{
          backgroundColor: "#f0f6ff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 10,
          color: "#2664eb",
          mt: 6,
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: "black", fontWeight: "bold", mb: 4 }}
        >
          How It Works
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {[
            {
              icon: <AccountBalanceWalletIcon fontSize="large" />,
              title: "1. Create Your Account",
              desc: "Get started in minutes with our simple and secure sign-up process",
            },
            {
              icon: <StackedBarChartIcon fontSize="large" />,
              title: "2. Track Your Spending",
              desc: "Automatically categorize and track your transactions in real-time",
            },
            {
              icon: <AvTimerIcon fontSize="large" />,
              title: "3. Get Insights",
              desc: "Receive AI-powered insights and recommendations to optimize your finances",
            },
          ].map((step, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                maxWidth: 250,
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#dbebff",
                  borderRadius: "50%",
                  p: 2,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {React.cloneElement(step.icon, {
                  color: "primary",
                  sx: { fontSize: 40 },
                })}
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mb: 1, color: "black" }}
              >
                {step.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontWeight: "medium",
                  fontSize: "medium",
                }}
              >
                {step.desc}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* What Our Users Say*/}
      <Box>
        <Typography
          variant="h4"
          align="center"
          sx={{ color: "black", fontWeight: "bold", mt: 4 }}
        >
          What Our Users Say
        </Typography>
      </Box>
    </>
  );
}

export default LandingPage;
