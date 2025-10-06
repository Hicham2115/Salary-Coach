import * as React from "react";
import { useSignIn } from "@clerk/clerk-react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  Paper,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { axiosClient } from "../Api/axios";
import { useForm } from "@mantine/form";
import { NumberInput, TextInput } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

export default function CustomSignIn() {
  const { signIn, isLoaded } = useSignIn();
  const [error, setError] = React.useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const errorloginmssg = React.useRef("");

  const form = useForm({
    initialValues: { email: "hihchamnadi@gmail.com", password: "ssssssssssss" },

    // functions will be used to validate values at corresponding key
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must have at least 6 characters" : null,
    },
  });

  const handleSocialSignIn = async (provider) => {
    try {
      await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: `/dashboard?provider=${provider}`,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to sign in with " + provider);
    }
  };

  const handleManualSignIn = async () => {
    setIsLoading(true);

    const { email, password } = form.values;

    try {
      // Step 1: Get CSRF cookie
      await axiosClient.get("/sanctum/csrf-cookie");

      // Step 2: Attempt login
      const response = await axiosClient.post("/api/login", {
        email,
        password,
      });

      // Step 3: Check response
      if (response.data.message === "User exists") {
        navigate("/dashboard", { state: { loginWithEmail: "true" } });
      } else {
        setIsLoading(false);
        errorloginmssg.current.innerHTML =
          "Login failed. Please check your email and password.";
        console.log("Login failed or unexpected response:", response.data);
      }
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  if (!isLoaded) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, rgba(255, 204, 204, 1) 0%, rgba(102, 204, 255, 1) 100%)",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 420,
          borderRadius: 3,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5" gutterBottom align="center" color="primary">
          Sign in to your account
        </Typography>

        <Button
          fullWidth
          variant="contained"
          onClick={() => handleSocialSignIn("google")}
          startIcon={<GoogleIcon />}
          sx={{
            mb: 1,
            textTransform: "none",
            backgroundColor: "#db4437",
            "&:hover": { backgroundColor: "#c1351d" },
          }}
        >
          Sign in with Google
        </Button>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => handleSocialSignIn("facebook")}
          startIcon={<FacebookIcon />}
          sx={{
            textTransform: "none",
            backgroundColor: "#3b5998",
            "&:hover": { backgroundColor: "#2d4373" },
          }}
        >
          Sign in with Facebook
        </Button>

        <Divider sx={{ my: 3 }}>OR</Divider>
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
          <TextInput
            mt="sm"
            label="Email"
            placeholder="Enter your email"
            {...form.getInputProps("email")}
          />
          <TextInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            {...form.getInputProps("password")}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            onClick={handleManualSignIn}
            sx={{ mt: 2, textTransform: "none" }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Login with Email"
            )}
            {/* Login with Email */}
          </Button>
          <Typography
            ref={errorloginmssg}
            color="error"
            align="center"
            sx={{ mt: 1, fontSize: "0.875rem" }}
          ></Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              textAlign: "center",
              cursor: "pointer",
              color: "primary.main",
              textDecoration: "underline",
            }}
            onClick={() => {
              navigate("/Registre");
            }}
          >
            Don't have an account? Sign up
          </Typography>
        </form>
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
