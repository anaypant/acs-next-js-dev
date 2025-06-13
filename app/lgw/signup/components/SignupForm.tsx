"use client";

import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  SelectChangeEvent,
} from "@mui/material";

export function SignupForm() {
  const [adType, setAdType] = useState("");

  const handleAdTypeChange = (event: SelectChangeEvent) => {
    setAdType(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission here
  };

  return (
    <Box
      sx={{
        background: "white",
        p: { xs: 3, sm: 4, md: 6 },
        borderRadius: 2,
        boxShadow: "0 8px 16px -4px rgba(0,0,0,0.1)",
      }}
    >
      <Box
        sx={{
          background: "linear-gradient(to right, #0a5a2f, #157a42)",
          color: "white",
          p: 2,
          borderRadius: "4px 4px 0 0",
          mx: -6,
          mt: -6,
          mb: 4,
          textAlign: "center"
        }}
      >
        <Typography variant="h5" component="h1" fontWeight="bold">
          Create Your Ad Campaign
        </Typography>
      </Box>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: "center" }}>
        Define the specifics of your advertising campaign to generate new leads.
      </Typography>

      <form onSubmit={handleSubmit} noValidate autoComplete="off">
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Advertising Budget ($)"
            type="number"
            variant="outlined"
            required
            name="budget"
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth variant="outlined" required>
            <InputLabel>Type of Ad</InputLabel>
            <Select
              value={adType}
              onChange={handleAdTypeChange}
              label="Type of Ad"
              name="adType"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="facebook">Facebook Marketplace Ad</MenuItem>
              <MenuItem value="google-ppc">Google PPC Ad</MenuItem>
              <MenuItem value="other">Other (Please specify below)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="Specific Requests"
            multiline
            rows={4}
            variant="outlined"
            placeholder="e.g., Target audience, ad copy ideas, specific locations..."
            name="requests"
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            py: 1.5,
            background: "linear-gradient(to right, #0e6537, #157a42)",
            "&:hover": {
              background: "linear-gradient(to right, #157a42, #1a8a4a)",
            },
          }}
        >
          Submit Campaign Request
        </Button>
      </form>
    </Box>
  );
} 