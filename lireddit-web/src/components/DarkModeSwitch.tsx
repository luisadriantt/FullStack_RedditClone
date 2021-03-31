import { useColorMode, Switch } from "@chakra-ui/react";

export const DarkModeSwitch = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <>
      <Switch
        position="fixed"
        top="1rem"
        right="1rem"
        color="green"
        isChecked={isDark}
        onChange={toggleColorMode}
      />
      {children}
    </>
  );
};
