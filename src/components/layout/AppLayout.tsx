import Sidebar from "./Sidebar";
import Header from "./Header";

interface Props {
  children: React.ReactNode;
}

const AppLayout = ({
  children,
}: Props) => {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="content-area">
        <Header />

        <main>{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;