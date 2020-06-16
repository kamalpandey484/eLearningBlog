import Header from './Header';
import { theme, ThemeProvider, CSSReset, ColorModeProvider } from "@chakra-ui/core";

const breakpoints = ["360px", "768px", "1024px", "1440px"];
breakpoints.sm = breakpoints[0];
breakpoints.md = breakpoints[1];
breakpoints.lg = breakpoints[2];
breakpoints.xl = breakpoints[3];

const newTheme = {
  ...theme,
  breakpoints
};

const Layout = ({ children }) => {
  return (
    <ThemeProvider theme={newTheme}>
      <ColorModeProvider>
        <CSSReset />
        <React.Fragment>
          <Header />
          {children}
          <p>Footer</p>
        </React.Fragment>
      </ColorModeProvider>
    </ThemeProvider>
  )
}

export default Layout;
