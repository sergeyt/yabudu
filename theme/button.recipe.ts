import { defineRecipe } from "@chakra-ui/react";

export const buttonRecipe = defineRecipe({
  variants: {
    variant: {
      //
      // --- Primary CTA gradient ---
      //
      gradient: {
        backgroundImage:
          "linear-gradient(135deg, var(--chakra-colors-blue-500) 0%, var(--chakra-colors-green-400) 100%)",
        color: "white",
        _hover: {
          opacity: 0.95,
          transform: "translateY(-1px)",
          boxShadow: "0 7px 20px rgba(0,0,0,0.22)",
        },
        _active: {
          opacity: 0.9,
          transform: "translateY(0)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
        },
      },

      //
      // --- Danger gradient (red → pink) ---
      //
      danger: {
        backgroundImage:
          "linear-gradient(135deg, var(--chakra-colors-red-500) 0%, var(--chakra-colors-pink-500) 100%)",
        color: "white",
        _hover: {
          opacity: 0.92,
          transform: "translateY(-1px)",
          boxShadow: "0 7px 20px rgba(0,0,0,0.22)",
        },
        _active: {
          opacity: 0.85,
          transform: "translateY(0)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
        },
      },

      //
      // --- Warning gradient (yellow → orange) ---
      //
      warning: {
        backgroundImage:
          "linear-gradient(135deg, var(--chakra-colors-yellow-400) 0%, var(--chakra-colors-orange-500) 100%)",
        color: "black",
        _hover: {
          opacity: 0.92,
          transform: "translateY(-1px)",
          boxShadow: "0 7px 20px rgba(0,0,0,0.22)",
        },
        _active: {
          opacity: 0.85,
          transform: "translateY(0)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
        },
      },

      //
      // --- Success gradient (green → teal) ---
      //
      success: {
        backgroundImage:
          "linear-gradient(135deg, var(--chakra-colors-green-500) 0%, var(--chakra-colors-teal-400) 100%)",
        color: "white",
        _hover: {
          opacity: 0.93,
          transform: "translateY(-1px)",
          boxShadow: "0 7px 20px rgba(0,0,0,0.22)",
        },
        _active: {
          opacity: 0.87,
          transform: "translateY(0)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
        },
      },

      //
      // --- Info gradient (blue → purple) ---
      //
      info: {
        backgroundImage:
          "linear-gradient(135deg, var(--chakra-colors-blue-400) 0%, var(--chakra-colors-purple-500) 100%)",
        color: "white",
        _hover: {
          opacity: 0.93,
          transform: "translateY(-1px)",
          boxShadow: "0 7px 20px rgba(0,0,0,0.22)",
        },
        _active: {
          opacity: 0.87,
          transform: "translateY(0)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
        },
      },

      //
      // --- Glass button ---
      //
      glass: {
        backgroundColor: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.2)",
        color: "white",
        _hover: {
          backgroundColor: "rgba(255,255,255,0.18)",
        },
        _active: {
          backgroundColor: "rgba(255,255,255,0.25)",
        },
      },

      //
      // --- Neon glowing button ---
      //
      neon: {
        backgroundColor: "var(--chakra-colors-purple-600)",
        color: "white",
        textShadow: "0 0 8px rgba(255,255,255,0.7)",
        boxShadow:
          "0 0 8px var(--chakra-colors-purple-400), 0 0 16px var(--chakra-colors-purple-500)",
        _hover: {
          boxShadow:
            "0 0 10px var(--chakra-colors-purple-400), 0 0 20px var(--chakra-colors-purple-500), 0 0 35px var(--chakra-colors-purple-600)",
          transform: "translateY(-1px)",
        },
        _active: {
          boxShadow:
            "0 0 6px var(--chakra-colors-purple-400), 0 0 14px var(--chakra-colors-purple-500)",
          transform: "translateY(0)",
        },
      },

      //
      // --- Outline gradient button ---
      //
      outlineGradient: {
        backgroundColor: "transparent",
        border: "2px solid",
        borderImageSlice: 1,
        borderImageSource:
          "linear-gradient(135deg, var(--chakra-colors-blue-500), var(--chakra-colors-purple-500))",
        color: "var(--chakra-colors-blue-600)",
        _hover: {
          backgroundImage:
            "linear-gradient(135deg, var(--chakra-colors-blue-50), var(--chakra-colors-purple-50))",
        },
        _active: {
          backgroundImage:
            "linear-gradient(135deg, var(--chakra-colors-blue-100), var(--chakra-colors-purple-100))",
        },
      },
    },
  },
});
