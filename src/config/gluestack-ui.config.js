import { createConfig } from "@gluestack-ui/themed";

export const config = createConfig({
  tokens: {
    colors: {
      primary: "#0066FF",
      secondary: "#6C757D",
      // Add more custom colors as needed
    },
  },
  components: {
    // You can customize component styles here
    Button: {
      theme: {
        variants: {
          defaults: {
            bg: "$primary",
            color: "$white",
          },
        },
      },
    },
  },
});
