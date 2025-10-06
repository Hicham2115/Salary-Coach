import React from "react";
import { useForm } from "@mantine/form";
import { TextInput, PasswordInput, Button, Paper } from "@mantine/core";
import { TextField, Typography, Box, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../Api/axios";

export default function Registre() {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      firstName: "hicham",
      lastName: "kamani",
      email: "hihchamnadi@gmail.com",
      password: "ssssssssssss",
    },

    validate: {
      firstName: (value) =>
        value.length < 2 ? "First name is required" : null,
      lastName: (value) => (value.length < 2 ? "Last name is required" : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 6 ? "Password must have at least 6 characters" : null,
    },
  });

  const handleRegister = async () => {
    const { firstName, lastName, email, password } = form.values;
    console.log("User Registered:", { firstName, lastName, email, password });

    // Get CSRF cookie
    await axiosClient.get("/sanctum/csrf-cookie");

    axiosClient
      .post("/api/register", { firstName, lastName, email, password })
      .then((response) => {
        console.log(response.data);
        navigate("/signup");
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  return (
    <Paper
      shadow="lg"
      p="xl"
      sx={{
        maxWidth: 400,
        margin: "auto",
        backgroundColor: "#f7f7f7",
        borderRadius: "12px",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        mb={2}
        color="primary"
        fontWeight="bold"
      >
        Register
      </Typography>

      <form onSubmit={form.onSubmit(handleRegister)}>
        <TextInput
          label="First Name"
          placeholder="Enter your first name"
          {...form.getInputProps("firstName")}
          mb={16}
        />
        <TextInput
          label="Last Name"
          placeholder="Enter your last name"
          {...form.getInputProps("lastName")}
          mb={16}
        />
        <TextInput
          label="Email"
          placeholder="Enter your email"
          {...form.getInputProps("email")}
          mb={16}
        />
        <PasswordInput
          label="Password"
          type="password"
          placeholder="Enter your password"
          {...form.getInputProps("password")}
          mb={24}
        />
        <Button
          type="submit"
          fullWidth
          sx={{
            backgroundColor: "#4CAF50",
            color: "white",
            "&:hover": {
              backgroundColor: "#45a049",
            },
            textTransform: "none",
          }}
        >
          Register
        </Button>
      </form>

      <Typography
        variant="body2"
        mt={2}
        align="center"
        sx={{
          cursor: "pointer",
          color: "primary.main",
        }}
        onClick={() => {
          navigate("/SignUp");
        }} // Redirect to login page
      >
        Already have an account? Login
      </Typography>
    </Paper>
  );
}
