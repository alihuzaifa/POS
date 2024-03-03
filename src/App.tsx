import { useMemo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import Layout from "./scenes/layout";
import { themeSettings } from "./theme";
import { useSelector } from "react-redux";
import SignIn from "./scenes/signin";
import "./App.css"
import { Toaster } from "react-hot-toast";
import Forget from "./scenes/signin/forget";
interface RootState {
  user: any;
}
const App = () => {
  const themeMode = useSelector((state: RootState) => state?.user?.mode);
  const isLogin = useSelector((state: RootState) => state?.user?.isLogin);
  const isForget = useSelector((state: RootState) => state?.user?.isForget);
  const theme = useMemo(() => createTheme(themeSettings(themeMode)), [themeMode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster />
      {isLogin ? <Layout /> : isForget ? <Forget /> : <SignIn />}
    </ThemeProvider>
  );
};
export default App;